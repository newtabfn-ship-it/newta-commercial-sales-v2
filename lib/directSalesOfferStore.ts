import { mongo } from "mongoose";
import type { DirectSaleOfferRecord } from "@/models/DirectSaleOffer";
import { acceptsOffers } from "@/lib/directSales";
import { isObjectId } from "@/lib/directSalesApi";
import { PortfolioApiError } from "@/lib/directSalesPortfolioAdmin";
import { portfolioDatabase, lockPortfolios, withPortfolioTransaction } from "@/lib/directSalesPortfolioDb";

export type OfferRow = DirectSaleOfferRecord & { _id: mongo.ObjectId; __v?: number };
export type OfferSubmission = {
  id: string; assetId: string; buyerName: string; phone: string;
  email: string; message: string; amountCents: number;
};
const operation = { maxTimeMS: 5000 };
const replayProjection = { assetId: 1, buyerName: 1, phone: 1, email: 1, message: 1, amountCents: 1 } as const;

export async function offerStore() {
  const database = await portfolioDatabase();
  const db = database.connection.db!;
  // Native handles avoid registering the auto-indexed legacy Offer/Limit models.
  return { ...database,
    offers: db.collection<OfferRow>("directsaleoffers"),
    limits: db.collection<{ _id: string; count: number; expiresAt: Date }>("directsaleofferlimits"),
  };
}
export type OfferStore = Awaited<ReturnType<typeof offerStore>>;

export async function requireOfferStorage(store: OfferStore) {
  for (const name of [store.offers.collectionName, store.limits.collectionName]) {
    const exists = await store.connection.db!.listCollections({ name }, { nameOnly: true, ...operation }).next();
    if (!exists) throw new PortfolioApiError(503, "Offer storage requires separately approved setup.");
  }
}

export async function replayOffer(store: OfferStore, input: OfferSubmission, session?: mongo.ClientSession) {
  const existing = await store.offers.findOne({ _id: new mongo.ObjectId(input.id) }, { projection: replayProjection, ...operation, readPreference: "primary", ...(session ? { session } : {}) });
  if (!existing) return null;
  // Never compare or overwrite a historical snapshot when replaying a receipt.
  return String(existing.assetId) === input.assetId && existing.buyerName === input.buyerName &&
    existing.phone === input.phone && existing.email === input.email &&
    existing.message === input.message && existing.amountCents === input.amountCents ? "received" : "conflict";
}

export async function submitPortfolioOffer(store: OfferStore, input: OfferSubmission) {
  return withPortfolioTransaction(store, async session => {
    const previous = await replayOffer(store, input, session);
    if (previous) return previous;
    const asset = await store.assets.findOneAndUpdate(
      { _id: input.assetId, status: "Published" }, { $inc: { __v: 1 } },
      { session, ...operation, new: true, timestamps: false }
    ).select("status closesAt title referenceNumber askingPriceCents portfolioId").lean();
    if (!asset || !acceptsOffers(asset)) throw new PortfolioApiError(409, "This asset is no longer accepting offers.");
    if (typeof asset.title !== "string" || !asset.title || typeof asset.referenceNumber !== "string" || !asset.referenceNumber ||
        (asset.askingPriceCents != null && !Number.isFinite(asset.askingPriceCents))) {
      throw new PortfolioApiError(409, "This asset's details must be corrected before it can receive offers.");
    }
    if (asset.portfolioId != null && !isObjectId(String(asset.portfolioId))) {
      throw new PortfolioApiError(409, "This asset's Sales Portfolio assignment must be corrected before it can receive offers.");
    }
    const portfolioId = asset.portfolioId == null ? null : new mongo.ObjectId(String(asset.portfolioId));
    await lockPortfolios(store, portfolioId ? [String(portfolioId)] : [], session);
    // A hidden/Archived portfolio does not close its individual assets.
    if (!acceptsOffers(asset)) throw new PortfolioApiError(409, "This asset is no longer accepting offers.");
    const now = new Date();
    await store.offers.insertOne({
      _id: new mongo.ObjectId(input.id), assetId: asset._id,
      assetReference: asset.referenceNumber, assetTitle: asset.title,
      askingPriceCents: asset.askingPriceCents ?? null,
      portfolioIdAtSubmission: portfolioId,
      buyerName: input.buyerName, phone: input.phone, email: input.email,
      message: input.message, amountCents: input.amountCents,
      currency: "ZAR", status: "New", internalNotes: "", createdAt: now, updatedAt: now, __v: 0,
    }, { session });
    return "received" as const;
  });
}
