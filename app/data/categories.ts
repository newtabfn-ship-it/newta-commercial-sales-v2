export type CategoryType =
  | "commercial-vehicles"
  | "plant-machinery"
  | "mining-equipment"
  | "drilling-rigs"
  | "other-assets";

export interface EquipmentSubcategory {
  name: string;
  slug: string;
  seoSlug?: string;
  group?: string;
}

export interface EquipmentCategory {
  name: string;
  slug: string;
  type: CategoryType;
  seoSlug?: string;
  subcategories: EquipmentSubcategory[];
}

export const equipmentCategories: EquipmentCategory[] = [
  {
    name: "Commercial Vehicles",
    slug: "commercial-vehicles",
    type: "commercial-vehicles",
    subcategories: [
    {
  name: "Trucks",
  slug: "trucks",
  seoSlug: "trucks-for-sale-south-africa",
  group: "trucks",
},
{
  name: "Cement Mixer Trucks",
  slug: "cement-mixer-trucks",
  seoSlug: "cement-mixer-trucks-for-sale-south-africa",
  group: "trucks",
},
{
  name: "Crane Trucks",
  slug: "crane-trucks",
  seoSlug: "crane-trucks-for-sale-south-africa",
  group: "trucks",
},
{
  name: "Truck Tractors",
  slug: "truck-tractors",
  seoSlug: "truck-tractors-for-sale-south-africa",
  group: "trucks",
},
{
  name: "Other Trucks",
  slug: "other-trucks",
  seoSlug: "other-trucks-for-sale-south-africa",
  group: "trucks",
},
      {
        name: "Buses",
        slug: "buses",
        seoSlug: "buses-for-sale-south-africa",
      },
      {
        name: "Cars / Passenger Vehicles",
        slug: "cars-passenger-vehicles",
        seoSlug: "cars-for-sale-south-africa",
      },
      {
        name: "Bakkies / Pickups",
        slug: "bakkies-pickups",
        seoSlug: "bakkies-for-sale-south-africa",
      },
      {
        name: "Trailers",
        slug: "trailers",
        seoSlug: "trailers-for-sale-south-africa",
      },
      
    ],
  },

  {
    name: "Plant & Machinery",
    slug: "plant-machinery",
    type: "plant-machinery",
    seoSlug: "plant-machinery-for-sale-south-africa",
    subcategories: [
      {
        name: "Crushing & Screening",
        slug: "crushing-screening",
        seoSlug:
          "mobile-crushers-screening-equipment-for-sale-south-africa",
      },
      {
        name: "Cranes",
        slug: "cranes",
        seoSlug: "cranes-for-sale-south-africa",
      },
      {
        name: "Construction Equipment",
        slug: "construction-equipment",
        seoSlug: "construction-equipment-for-sale-south-africa",
      },
      {
        name: "Agricultural Equipment",
        slug: "agricultural-equipment",
        seoSlug: "agricultural-equipment-for-sale-south-africa",
      },
      {
        name: "Compressors",
        slug: "compressors",
        seoSlug: "compressors-for-sale-south-africa",
      },
    ],
  },

   {
    name: "Mining Equipment",
    slug: "mining-equipment",
    type: "mining-equipment",
    seoSlug: "mining-equipment-for-sale-south-africa",
    subcategories: [],
  },

  {
    name: "Drilling Rigs",
    slug: "drilling-rigs",
    type: "drilling-rigs",
    seoSlug: "drilling-rigs-for-sale-south-africa",
    subcategories: [],
  },

    {
    name: "Other Assets",
    slug: "other-assets",
    type: "other-assets",
    seoSlug: "other-assets-for-sale-south-africa",
    subcategories: [
      {
        name: "Other Assets",
        slug: "other-assets",
        seoSlug: "other-assets-for-sale-south-africa",
      },
    ],
  },

];