import { equipmentCategories } from "@/app/data/categories";

export const directSaleCategories = equipmentCategories.map(({ slug, name }) => ({ slug, name }));
export const assetStatuses = ["Draft", "Published", "Closed", "Sold"] as const;
export const offerStatuses = ["New", "Contacted", "Under Negotiation", "Accepted", "Declined", "Closed"] as const;
export const offerTerms = "Offers are private, non-binding and subject to confirmation by NEWTA. The highest offer is not necessarily accepted. Submitting an offer does not reserve or purchase the asset.";
export const publicAssetStatuses = ["Published", "Closed", "Sold"] as const;

export function acceptsOffers(asset: { status: string; closesAt?: Date | string | null }, now = Date.now()) {
  return asset.status === "Published" && (!asset.closesAt || new Date(asset.closesAt).getTime() > now);
}

export function randToCents(value: unknown): number | null {
  if (typeof value !== "string" || !/^\d{1,10}(?:\.\d{1,2})?$/.test(value)) return null;
  const [rand, cents = ""] = value.split(".");
  const amount = Number(rand) * 100 + Number(cents.padEnd(2, "0"));
  return amount > 0 ? amount : null;
}

export function formatRand(cents: number) {
  return new Intl.NumberFormat("en-ZA", { style: "currency", currency: "ZAR" }).format(cents / 100);
}

export function parseSastClosing(value: string): Date | null {
  if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(value)) return null;
  const date = new Date(`${value}:00+02:00`);
  if (!Number.isFinite(date.getTime())) return null;
  return toSastInput(date) === value ? date : null;
}

export function toSastInput(value: Date | string) {
  return new Date(new Date(value).getTime() + 2 * 60 * 60 * 1000).toISOString().slice(0, 16);
}
