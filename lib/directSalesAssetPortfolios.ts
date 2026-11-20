import { mongo } from "mongoose";
import type { assetInput } from "@/lib/directSalesApi";
import { PortfolioApiError } from "@/lib/directSalesPortfolioAdmin";
import { portfolioDatabase, lockPortfolios, withPortfolioTransaction } from "@/lib/directSalesPortfolioDb";

type AssetInput = NonNullable<ReturnType<typeof assetInput>>;
const operation = { maxTimeMS: 5000 };

export async function saveAssetWithPortfolio(input: AssetInput, target: { slug: string } | { id: string; updatedAt: Date }) {
  const database = await portfolioDatabase();
  // Identity is fixed outside the retryable callback; each retry uses fresh docs.
  const id = new mongo.ObjectId("id" in target ? target.id : undefined);
  return withPortfolioTransaction(database, async session => {
    const { assets } = database;
    let previous: string | null | undefined;
    let closedAt: Date | null = null;
    if ("id" in target) {
      // Real write acquires the asset lock, even for an Unassigned asset.
      // Do not advance updatedAt until the final save, preserving the edit CAS.
      const existing = await assets.findOneAndUpdate(
        { _id: id, updatedAt: target.updatedAt }, { $inc: { __v: 1 } },
        { session, ...operation, new: true, timestamps: false }
      ).lean();
      if (!existing) {
        const exists = await assets.findById(id).session(session).maxTimeMS(5000).select("_id").lean();
        throw new PortfolioApiError(exists ? 409 : 404, exists
          ? "The asset changed. Reload before editing again." : "Asset not found.");
      }
      previous = existing.portfolioId == null ? existing.portfolioId : String(existing.portfolioId);
      closedAt = existing.closedAt ?? null;
    }
    const requested = Object.hasOwn(input, "portfolioId");
    const next = requested ? input.portfolioId : previous;
    closedAt = input.status === "Closed" || input.status === "Sold" ? closedAt ?? new Date() : null;
    // Insert locks the new asset first. Any subsequent validation failure rolls
    // it back with the portfolio locks; it is never visible before commit.
    const created = "slug" in target
      ? (await assets.create([{ ...input, _id: id, slug: target.slug, closedAt }], { session }))[0]
      : null;
    await lockPortfolios(database, [previous, next].filter((value): value is string => typeof value === "string"), session);
    if (requested && typeof next === "string") {
      const portfolio = await database.portfolios.findOne({ _id: new mongo.ObjectId(next) }, { session, ...operation });
      if (!portfolio || !["Draft", "Published"].includes(portfolio.status)) {
        throw new PortfolioApiError(409, "Select an existing Draft or Published Sales Portfolio. Archived Sales Portfolios cannot receive assignments.");
      }
    }
    if (created) return created;
    if (!("id" in target)) throw new PortfolioApiError(503, "Asset creation could not be confirmed.");
    const asset = await assets.findOneAndUpdate(
      { _id: id, updatedAt: target.updatedAt },
      { $set: { ...input, closedAt, updatedAt: new Date(Math.max(Date.now(), target.updatedAt.getTime() + 1)) } },
      { session, ...operation, new: true, runValidators: true, timestamps: false }
    );
    if (!asset) throw new PortfolioApiError(409, "The asset changed. Reload before editing again.");
    return asset;
  });
}
