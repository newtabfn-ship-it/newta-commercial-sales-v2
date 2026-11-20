// Display labels only: never changes stored categories or public URLs.
export function assetCategoryLabel(category?: unknown): string {
  switch (category) {
    case "Commercial Vehicles":
    case "Plant & Machinery":
    case "Mining Equipment":
    case "Drilling Rigs":
    case "Other Assets":
      return category;
    default:
      return "Asset";
  }
}
