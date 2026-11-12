import { equipmentCategories } from "@/app/data/categories";

export const trailerTypes = {
  "side-tipper": "Side Tipper",
  "backend-tipper": "Backend Tipper",
  dropside: "Dropside",
  flatdeck: "Flatdeck",
  lowbed: "Lowbed",
  skeletal: "Skeletal",
  tanker: "Tanker",
  tautliner: "Tautliner",
  other: "Other Trailer",
};

type TrailerType = keyof typeof trailerTypes;
type Classification = { category?: unknown; subcategory?: unknown; trailerType?: unknown };

const trailerPatterns: Record<Exclude<TrailerType, "other">, RegExp> = {
  "side-tipper": /\bside[\s-]*tipper\b/i,
  "backend-tipper": /\b(?:back[\s-]*end[\s-]*tipper|rear[\s-]*tipp(?:er|ing)|sloper|copelyn)\b/i,
  dropside: /\bdrop[\s-]*side\b/i,
  flatdeck: /\bflat[\s-]*deck\b/i,
  lowbed: /\blow[\s-]*bed\b/i,
  skeletal: /\bskeletal\b/i,
  tanker: /\btanker\b/i,
  tautliner: /\btautliner\b/i,
};

export function isTrailer(record: Classification) {
  return record.category === "Commercial Vehicles" && record.subcategory === "Trailers";
}

function isTrailerType(value: unknown): value is TrailerType {
  return typeof value === "string" && Object.hasOwn(trailerTypes, value);
}

export function matchesTrailerType(
  item: Classification & { title?: string; description?: string; model?: string; make?: string; type?: string },
  type: Exclude<TrailerType, "other">
) {
  if (!isTrailer(item)) return false;
  if (isTrailerType(item.trailerType)) return item.trailerType === type;
  return trailerPatterns[type].test([item.title, item.description, item.model, item.make, item.type].join(" "));
}

export function validateEquipmentClassification(next: Classification, previous?: Classification) {
  const unchanged = previous &&
    next.category === previous.category &&
    (next.subcategory ?? "") === (previous.subcategory ?? "") &&
    (next.trailerType ?? "") === (previous.trailerType ?? "");
  if (unchanged) return null;

  const category = equipmentCategories.find(({ name }) => name === next.category);
  const subcategory = next.subcategory ?? "";
  if (!category || (category.subcategories.length
    ? !category.subcategories.some(({ name }) => name === subcategory)
    : subcategory !== "")) {
    return "Select a valid category and subcategory.";
  }
  if (isTrailer(next) ? !isTrailerType(next.trailerType) : (next.trailerType ?? "") !== "") {
    return isTrailer(next) ? "Select a trailer type." : "Trailer type applies only to trailers.";
  }
  return null;
}

const editableFields = [
  "referenceNumber", "title", "category", "subcategory", "trailerType", "manufacturer",
  "model", "year", "serialNumber", "kmHours", "tyresTracks", "province", "price",
  "currency", "vatIncluded", "status", "condition", "description", "specifications",
  "images", "featured", "showOnHomePage",
] as const;

export function equipmentWriteFields(body: unknown): Record<string, unknown> | null {
  if (!body || typeof body !== "object" || Array.isArray(body)) return null;
  const input = body as Record<string, unknown>;
  return Object.fromEntries(editableFields.filter((key) => Object.hasOwn(input, key)).map((key) => [key, input[key]]));
}

export function equipmentPublication(item: Parameters<typeof matchesTrailerType>[0] & { slug?: string; status?: string }) {
  const publicUrl = item.slug ? `/equipment/${encodeURIComponent(item.slug)}` : null;
  if (item.status !== "Available") return { publicUrl, expectedPages: [] };

  const pages = new Set(["/equipment"]);
  const category = equipmentCategories.find(({ name }) => name === item.category);
  const subcategory = category?.subcategories.find(({ name }) => name === item.subcategory);
  if (category?.seoSlug && category.slug !== "commercial-vehicles") pages.add(`/equipment/${category.seoSlug}`);
  if (subcategory?.seoSlug) pages.add(`/equipment/${subcategory.seoSlug}`);
  if (subcategory?.group === "trucks" || subcategory?.group === "truck-sizes") {
    pages.add("/equipment/trucks-for-sale-south-africa");
  }
  if (category?.slug === "plant-machinery" && subcategory?.slug === "crushing-screening") {
    pages.add("/equipment/mining-equipment-for-sale-south-africa");
  }
  for (const type of Object.keys(trailerPatterns) as (keyof typeof trailerPatterns)[]) {
    if (matchesTrailerType(item, type)) pages.add(`/equipment/${type}-trailers-for-sale-south-africa`);
  }
  return { publicUrl, expectedPages: [...pages] };
}
