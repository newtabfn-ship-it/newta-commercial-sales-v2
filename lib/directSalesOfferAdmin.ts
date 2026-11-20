import { mongo } from "mongoose";
import { isObjectId } from "@/lib/directSalesApi";
import { offerStatuses, parseSastClosing } from "@/lib/directSales";
import { PortfolioApiError } from "@/lib/directSalesPortfolioAdmin";
import { offerStore, type OfferRow } from "@/lib/directSalesOfferStore";
import { proposedOfferPortfolioIndex } from "@/lib/directSalesPortfolios";

type Membership = { state: "Assigned" | "Unassigned" | "Unknown"; id?: string; title?: string | null; status?: string | null };
type PortfolioLabel = { title: string; slug: string; status: string };
type JoinedOffer = OfferRow & {
  currentAsset?: { portfolioId?: mongo.ObjectId | null }[];
  currentPortfolioDoc?: PortfolioLabel[]; historicalPortfolioDoc?: PortfolioLabel[];
};
const operation = { maxTimeMS: 5000, allowDiskUse: false };
const summaryFields = { _id: 1, assetId: 1, assetReference: 1, assetTitle: 1, amountCents: 1, status: 1, createdAt: 1, portfolioIdAtSubmission: 1 };
const detailFields = { ...summaryFields, askingPriceCents: 1, currency: 1, buyerName: 1, phone: 1, email: 1, message: 1, internalNotes: 1, updatedAt: 1, reviewedBy: 1 };

export function offerListInput(request: Request) {
  const params = new URL(request.url).searchParams;
  const status = params.get("status"), assetId = params.get("assetId");
  const page = Number(params.get("page") ?? "1");
  const from = params.get("from"), to = params.get("to");
  const start = from ? parseSastClosing(from + "T00:00") : null;
  const end = to ? parseSastClosing(to + "T00:00") : null;
  const selectedStatus = offerStatuses.find(value => value === status);
  const current = params.get("currentPortfolio") ?? "";
  const historical = params.get("submissionPortfolio") ?? "";
  const validMembership = (value: string) => ["", "unassigned", "unknown"].includes(value) || isObjectId(value);
  if ((status && !selectedStatus) || (assetId && !isObjectId(assetId)) ||
      !Number.isInteger(page) || page < 1 || page > 1000 || (from && !start) ||
      (to && !end) || (start && end && start > end) || !validMembership(current) || !validMembership(historical)) {
    throw new PortfolioApiError(400, "Invalid offer filters.");
  }
  const filter = {
    ...(selectedStatus ? { status: selectedStatus } : {}),
    ...(assetId ? { assetId: new mongo.ObjectId(assetId) } : {}),
    ...(start || end ? { createdAt: { ...(start ? { $gte: start } : {}), ...(end ? { $lt: new Date(end.getTime() + 86400000) } : {}) } } : {}),
    ...(historical === "unknown" ? { portfolioIdAtSubmission: { $exists: false } } :
      historical === "unassigned" ? { portfolioIdAtSubmission: { $eq: null, $exists: true } } :
      historical ? { portfolioIdAtSubmission: new mongo.ObjectId(historical) } : {}),
  };
  return { filter, page, current, historical };
}

const assetLookup = { $lookup: { from: "directsaleassets", let: { asset: "$assetId" }, pipeline: [
  { $match: { $expr: { $eq: ["$_id", "$$asset"] } } }, { $limit: 1 }, { $project: { _id: 1, portfolioId: 1 } },
], as: "currentAsset" } };

function portfolioLookup(expression: unknown, as: string) {
  return { $lookup: { from: "directsaleportfolios", let: { portfolio: { $ifNull: [expression, null] } }, pipeline: [
    { $match: { $expr: { $and: [{ $ne: ["$$portfolio", null] }, { $eq: ["$_id", "$$portfolio"] }] } } },
    { $limit: 1 }, { $project: { _id: 1, title: 1, slug: 1, status: 1 } },
  ], as } };
}
const labels = [
  portfolioLookup({ $arrayElemAt: ["$currentAsset.portfolioId", 0] }, "currentPortfolioDoc"),
  portfolioLookup("$portfolioIdAtSubmission", "historicalPortfolioDoc"),
];

function membership(value: unknown, label?: PortfolioLabel, includeStatus = true): Membership {
  if (value === undefined) return { state: "Unknown" };
  if (value === null) return { state: "Unassigned" };
  const id = String(value);
  return isObjectId(id) ? { state: "Assigned", id, title: label?.title ?? null,
    ...(includeStatus ? { status: label?.status ?? null } : {}) } : { state: "Unknown" };
}

function dto(row: JoinedOffer, detail = false) {
  const current = row.currentAsset?.[0];
  const summary = {
    _id: String(row._id), assetId: String(row.assetId), assetReference: row.assetReference,
    assetTitle: row.assetTitle, amountCents: row.amountCents, status: row.status, createdAt: row.createdAt,
    currentPortfolio: current ? membership(current.portfolioId ?? null, row.currentPortfolioDoc?.[0]) : { state: "Unknown" as const },
    portfolioAtSubmission: membership(row.portfolioIdAtSubmission, row.historicalPortfolioDoc?.[0], false),
    // Preserve the legacy missing-vs-null distinction in responses too.
    ...(Object.hasOwn(row, "portfolioIdAtSubmission") ? { portfolioIdAtSubmission: row.portfolioIdAtSubmission == null ? row.portfolioIdAtSubmission : String(row.portfolioIdAtSubmission) } : {}),
  };
  return detail ? { ...summary, buyerName: row.buyerName, phone: row.phone, email: row.email,
    message: row.message, internalNotes: row.internalNotes, askingPriceCents: row.askingPriceCents,
    currency: row.currency, updatedAt: row.updatedAt, reviewedBy: row.reviewedBy } : summary;
}

export async function adminOfferList(input: ReturnType<typeof offerListInput>) {
  const store = await offerStore();
  const pagination = [{ $skip: (input.page - 1) * 25 }, { $limit: 26 }];
  const currentMatch = input.current === "unknown" ? { "currentAsset.0": { $exists: false } } :
    input.current === "unassigned" ? { "currentAsset.0": { $exists: true }, "currentAsset.portfolioId": null } :
    input.current ? { "currentAsset.portfolioId": new mongo.ObjectId(input.current) } : null;
  // Filter BEFORE pagination. No unbounded asset-ID list or one-to-many unwind.
  const pipeline = [
    { $match: input.filter }, { $sort: { createdAt: -1, _id: -1 } },
    ...(currentMatch ? [assetLookup, { $match: currentMatch }, ...pagination] : [...pagination, assetLookup]),
    ...labels,
    { $project: { ...summaryFields, currentAsset: 1, currentPortfolioDoc: 1, historicalPortfolioDoc: 1 } },
  ];
  const [rows, newCount] = await Promise.all([
    store.offers.aggregate<JoinedOffer>(pipeline, {
      ...operation,
      ...(input.historical ? { hint: proposedOfferPortfolioIndex.options.name } : {}),
    }).toArray(),
    store.offers.countDocuments({ status: "New" }, { maxTimeMS: 5000 }),
  ]);
  return { offers: rows.slice(0, 25).map(row => dto(row)), newCount, hasNext: rows.length > 25 };
}

export async function adminOfferDetail(id: string) {
  const store = await offerStore();
  const rows = await store.offers.aggregate<JoinedOffer>([
    { $match: { _id: new mongo.ObjectId(id) } }, { $limit: 1 }, assetLookup, ...labels,
    { $project: { ...detailFields, currentAsset: 1, currentPortfolioDoc: 1, historicalPortfolioDoc: 1 } },
  ], operation).toArray();
  return rows[0] ? dto(rows[0], true) : null;
}
