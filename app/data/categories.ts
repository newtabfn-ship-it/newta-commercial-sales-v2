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
name: "Dropside Trucks",
slug: "dropside-trucks",
seoSlug: "dropside-trucks-for-sale-south-africa",
group: "trucks",
},
{
name: "Flatdeck Trucks",
slug: "flatdeck-trucks",
seoSlug: "flatdeck-trucks-for-sale-south-africa",
group: "trucks",
},
{
name: "Concrete Mixer Trucks",
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
name: "2 Ton Trucks",
slug: "2-ton-trucks",
seoSlug: "2-ton-trucks-for-sale-south-africa",
group: "truck-sizes",
},
{
name: "3 Ton Trucks",
slug: "3-ton-trucks",
seoSlug: "3-ton-trucks-for-sale-south-africa",
group: "truck-sizes",
},
{
name: "4 Ton Trucks",
slug: "4-ton-trucks",
seoSlug: "4-ton-trucks-for-sale-south-africa",
group: "truck-sizes",
},
{
name: "8 Ton Trucks",
slug: "8-ton-trucks",
seoSlug: "8-ton-trucks-for-sale-south-africa",
group: "truck-sizes",
},
{
name: "10 Ton Trucks",
slug: "10-ton-trucks",
seoSlug: "10-ton-trucks-for-sale-south-africa",
group: "truck-sizes",
},
{
name: "12 Ton Trucks",
slug: "12-ton-trucks",
seoSlug: "12-ton-trucks-for-sale-south-africa",
group: "truck-sizes",
},
{
name: "14 Ton Trucks",
slug: "14-ton-trucks",
seoSlug: "14-ton-trucks-for-sale-south-africa",
group: "truck-sizes",
},
{
name: "16 Ton Trucks",
slug: "16-ton-trucks",
seoSlug: "16-ton-trucks-for-sale-south-africa",
group: "truck-sizes",
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