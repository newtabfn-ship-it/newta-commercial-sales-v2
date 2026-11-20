import { equipmentCategories } from "@/app/data/categories";

export const truckWeightClasses = [
  "2 Ton Trucks", "3 Ton Trucks", "4 Ton Trucks", "8 Ton Trucks",
  "10 Ton Trucks", "12 Ton Trucks", "14 Ton Trucks", "16 Ton Trucks",
] as const;
export const usageUnits = ["km", "hours"] as const;

type Measurements = {
  category?: unknown;
  subcategory?: unknown;
  truckWeightClass?: unknown;
  usageUnit?: unknown;
};

const truckSubcategories = equipmentCategories
  .find(({ name }) => name === "Commercial Vehicles")!.subcategories
  .filter(({ group }) => group === "trucks" || group === "truck-sizes")
  .map(({ name }) => name);

export function isTruckEquipment(item: Measurements) {
  return item.category === "Commercial Vehicles" &&
    typeof item.subcategory === "string" && truckSubcategories.includes(item.subcategory);
}

export function usageLabel(unit?: unknown): string {
  if (unit === "km") return "Mileage (km)";
  if (unit === "hours") return "Operating hours";
  return "KM / Hours";
}

export function validateEquipmentMeasurements(item: Measurements): string | null {
  if (item.usageUnit !== undefined && item.usageUnit !== "" &&
      !usageUnits.some((unit) => unit === item.usageUnit)) {
    return "Select kilometres, operating hours or an unknown unit.";
  }
  if (item.truckWeightClass !== undefined && item.truckWeightClass !== "") {
    if (!truckWeightClasses.some((value) => value === item.truckWeightClass)) {
      return "Select a supported truck weight class or leave it unconfirmed.";
    }
    if (!isTruckEquipment(item)) return "Truck weight class applies only to commercial trucks.";
    if (truckWeightClasses.some((value) => value === item.subcategory) &&
        item.subcategory !== item.truckWeightClass) {
      return "Confirmed weight class conflicts with the existing weight subcategory.";
    }
  }
  return null;
}

export function truckWeightFilter(weightClass: string) {
  if (!truckWeightClasses.some((value) => value === weightClass)) {
    throw new Error("Unsupported truck weight class.");
  }
  return {
    category: "Commercial Vehicles",
    status: "Available",
    $or: [
      { truckWeightClass: weightClass, subcategory: { $in: truckSubcategories } },
      { subcategory: weightClass },
    ],
  };
}
