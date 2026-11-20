import { cache } from "react";
import { mongo } from "mongoose";
import { directSalesSaveModels } from "@/lib/directSalesSaveDb";
import DirectSalePortfolio, { type DirectSalePortfolioRecord } from "@/models/DirectSalePortfolio";
import { isSharingImageUrl, isPortfolioSlug, publicPortfolio, publicPortfolioProjection } from "@/lib/directSalesPortfolios";

export const salesBaseUrl = "https://newtacommercialsales.com";
export const portfolioPageSize = 24;
const projection = { ...publicPortfolioProjection, _id: 1, updatedAt: 1 };
const assetFields = "slug title location status closesAt askingPriceCents images";
type PortfolioRow = DirectSalePortfolioRecord & { _id: mongo.ObjectId };

async function database() {
  const { assets } = await directSalesSaveModels();
  const db = assets.db.db;
  if (!db) throw new Error("Sales Portfolio storage unavailable.");
  return { assets, portfolios: db.collection<PortfolioRow>(DirectSalePortfolio.collection.name) };
}

async function publicRead<T>(run: () => Promise<T>): Promise<T> {
  try { return await run(); }
  catch {
    console.warn("Sales Portfolio public content is temporarily unavailable.");
    throw new Error("Sales Portfolio content is temporarily unavailable.");
  }
}

function portfolioDto(row: PortfolioRow) {
  const fields = publicPortfolio({ ...row, sharingImageUrl: row.sharingImageUrl && isSharingImageUrl(row.sharingImageUrl) ? row.sharingImageUrl : "" });
  if (!fields || !/^[a-f0-9]{24}$/i.test(String(row._id))) return null;
  // Cover images use their own allowlist, independently of asset photographs.
  const { sharingImageUrl, ...safe } = fields;
  return { ...safe, sharingImageUrl: sharingImageUrl && isSharingImageUrl(sharingImageUrl) ? sharingImageUrl : "", id: String(row._id), updatedAt: row.updatedAt };
}

export function eligiblePortfolioAssets(now: Date) {
  return { status: "Published" as const, $or: [{ closesAt: null }, { closesAt: { $gt: now } }] };
}

export function portfolioPath(slug: string, page = 1) {
  return `/direct-sales/portfolios/${slug}${page > 1 ? "?page=" + page : ""}`;
}

export function portfolioUrl(slug: string, page = 1) {
  return salesBaseUrl + portfolioPath(slug, page);
}

export function portfolioPageNumber(value: unknown): number | null {
  if (value === undefined) return 1;
  if (typeof value !== "string" || !/^[1-9]\d{0,3}$/.test(value)) return null;
  const page = Number(value);
  return page <= 1000 ? page : null;
}

// Asset photographs retain their existing cloud restrictions. No image fetch occurs.
export function approvedPortfolioImage(value: unknown): value is string {
  if (typeof value !== "string") return false;
  try {
    const url = new URL(value);
    const cloud = process.env.CLOUDINARY_CLOUD_NAME;
    return Boolean(cloud && url.protocol === "https:" && url.origin === "https://res.cloudinary.com" &&
      !url.username && !url.password && !url.search && !url.hash &&
      url.pathname.startsWith("/" + cloud + "/image/upload/") &&
      /\/image\/upload\/(?:v\d+\/)?newta\/direct-sales\//.test(url.pathname));
  } catch { return false; }
}

// Request-scoped React cache only; no persistent cache of publication status.
export const getPublicPortfolioPage = cache(async (slug: string, page: number) => {
  if (!isPortfolioSlug(slug) || !Number.isInteger(page) || page < 1 || page > 1000) return null;
  return publicRead(async () => {
    const { assets, portfolios } = await database();
    const row = await portfolios.findOne({ slug, status: { $in: ["Published", "Archived"] } }, { projection, maxTimeMS: 5000 });
    const portfolio = row && portfolioDto(row);
    if (!portfolio) return null;
    if (portfolio.status === "Archived") return { portfolio, assets: [], page: 1, hasMore: false, shareImage: salesBaseUrl + "/og-image.png" };
    const rows = await assets.find({ portfolioId: new mongo.ObjectId(portfolio.id), ...eligiblePortfolioAssets(new Date()) })
      .select(assetFields).maxTimeMS(5000).sort({ createdAt: -1, _id: -1 })
      .skip((page - 1) * portfolioPageSize).limit(portfolioPageSize + 1).lean();
    if (page > 1 && rows.length === 0) return null;
    // Explicit second allowlist: never pass a complete DB asset to public props.
    const visible = rows.slice(0, portfolioPageSize).map(asset => ({
      _id: String(asset._id), slug: asset.slug, title: asset.title, location: asset.location,
      status: asset.status, closesAt: asset.closesAt, askingPriceCents: asset.askingPriceCents,
      images: asset.images.filter(image => approvedPortfolioImage(image.url)).map(image => ({ url: image.url, cover: image.cover })),
    }));
    const images = visible.flatMap(asset => [...asset.images].sort((a, b) => Number(b.cover) - Number(a.cover)));
    // The independently approved cover takes precedence; asset images are fallback only.
    const shareImage = (row?.sharingImageUrl && isSharingImageUrl(row.sharingImageUrl) ? row.sharingImageUrl : undefined) ??
      images[0]?.url ?? salesBaseUrl + "/og-image.png";
    return { portfolio, assets: visible, page, hasMore: rows.length > portfolioPageSize, shareImage };
  });
});

// One bounded aggregation, not one query per portfolio. No private client joins.
export async function eligiblePublicPortfolios() {
  return publicRead(async () => {
    const { assets, portfolios } = await database();
    const rows = await portfolios.aggregate<PortfolioRow>([
      { $match: { status: "Published" } },
      { $sort: { createdAt: -1, _id: -1 } },
      { $lookup: { from: assets.collection.name, let: { portfolio: "$_id" }, pipeline: [
        { $match: { ...eligiblePortfolioAssets(new Date()), $expr: { $eq: ["$portfolioId", "$$portfolio"] } } },
        { $limit: 1 }, { $project: { _id: 1 } },
      ], as: "eligibleAssets" } },
      { $match: { "eligibleAssets.0": { $exists: true } } },
      { $project: projection },
    ], { maxTimeMS: 5000, allowDiskUse: false }).toArray();
    return rows.map(portfolioDto).filter((portfolio): portfolio is NonNullable<typeof portfolio> => portfolio !== null);
  });
}

export async function publishedPortfolioBacklink(id: unknown) {
  if (id == null || !/^[a-f0-9]{24}$/i.test(String(id))) return null;
  return publicRead(async () => {
    const { portfolios } = await database();
    const row = await portfolios.findOne({ _id: new mongo.ObjectId(String(id)), status: "Published" }, { projection, maxTimeMS: 5000 });
    const portfolio = row && portfolioDto(row);
    return portfolio ? { title: portfolio.title, url: portfolioPath(portfolio.slug) } : null;
  });
}
