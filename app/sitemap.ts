import type { MetadataRoute } from "next";
import connectDB from "@/lib/mongodb";
import Equipment from "@/models/Equipment";

const BASE_URL = "https://newtacommercialsales.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  await connectDB();

  const equipment = await Equipment.find(
    { status: "Available" },
    "slug updatedAt"
  )
    .sort({ updatedAt: -1 })
    .lean();

  const equipmentPages: MetadataRoute.Sitemap = equipment
    .filter((item) => item.slug)
    .map((item) => ({
      url: `${BASE_URL}/equipment/${item.slug}`,
      lastModified: item.updatedAt || new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    }));

  const categoryPages: MetadataRoute.Sitemap = [
    // Main Equipment Pages

    {
      url: `${BASE_URL}/equipment`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },

    // Commercial Vehicles

    {
      url: `${BASE_URL}/equipment/trucks-for-sale-south-africa`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },

    {
      url: `${BASE_URL}/equipment/dropside-trucks-for-sale-south-africa`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },

    {
      url: `${BASE_URL}/equipment/flatdeck-trucks-for-sale-south-africa`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },

    {
      url: `${BASE_URL}/equipment/cement-mixer-trucks-for-sale-south-africa`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },

    {
      url: `${BASE_URL}/equipment/crane-trucks-for-sale-south-africa`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },

    {
      url: `${BASE_URL}/equipment/truck-tractors-for-sale-south-africa`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },

    // Truck Sizes

    {
      url: `${BASE_URL}/equipment/2-ton-trucks-for-sale-south-africa`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },

    {
      url: `${BASE_URL}/equipment/3-ton-trucks-for-sale-south-africa`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },

    {
      url: `${BASE_URL}/equipment/4-ton-trucks-for-sale-south-africa`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },

    {
      url: `${BASE_URL}/equipment/8-ton-trucks-for-sale-south-africa`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },

    {
      url: `${BASE_URL}/equipment/10-ton-trucks-for-sale-south-africa`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },

    {
      url: `${BASE_URL}/equipment/12-ton-trucks-for-sale-south-africa`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },

    {
      url: `${BASE_URL}/equipment/14-ton-trucks-for-sale-south-africa`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },

    {
      url: `${BASE_URL}/equipment/16-ton-trucks-for-sale-south-africa`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },

    {
      url: `${BASE_URL}/equipment/other-trucks-for-sale-south-africa`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },

    // Other Commercial Vehicles

    {
      url: `${BASE_URL}/equipment/buses-for-sale-south-africa`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },

    {
      url: `${BASE_URL}/equipment/cars-for-sale-south-africa`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },

    {
      url: `${BASE_URL}/equipment/bakkies-for-sale-south-africa`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },

    // Trailers

    {
      url: `${BASE_URL}/equipment/trailers-for-sale-south-africa`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },

    {
      url: `${BASE_URL}/equipment/flatdeck-trailers-for-sale-south-africa`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },

    {
      url: `${BASE_URL}/equipment/tautliner-trailers-for-sale-south-africa`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },

    {
      url: `${BASE_URL}/equipment/side-tipper-trailers-for-sale-south-africa`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },

    {
      url: `${BASE_URL}/equipment/backend-tipper-trailers-for-sale-south-africa`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },

    {
      url: `${BASE_URL}/equipment/dropside-trailers-for-sale-south-africa`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },

    {
      url: `${BASE_URL}/equipment/skeletal-trailers-for-sale-south-africa`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },

    {
      url: `${BASE_URL}/equipment/lowbed-trailers-for-sale-south-africa`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },

    {
      url: `${BASE_URL}/equipment/tanker-trailers-for-sale-south-africa`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },

    // Plant & Machinery

    {
      url: `${BASE_URL}/equipment/plant-machinery-for-sale-south-africa`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },

    {
      url: `${BASE_URL}/equipment/mobile-crushers-screening-equipment-for-sale-south-africa`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },

    {
      url: `${BASE_URL}/equipment/cranes-for-sale-south-africa`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },

    {
      url: `${BASE_URL}/equipment/construction-equipment-for-sale-south-africa`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },

    {
      url: `${BASE_URL}/equipment/agricultural-equipment-for-sale-south-africa`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },

    {
      url: `${BASE_URL}/equipment/compressors-for-sale-south-africa`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },

    // Mining & Drilling

    {
      url: `${BASE_URL}/equipment/mining-equipment-for-sale-south-africa`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },

    {
      url: `${BASE_URL}/equipment/drilling-rigs-for-sale-south-africa`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },

    // Other Assets

    {
      url: `${BASE_URL}/equipment/other-assets-for-sale-south-africa`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
  ];

  const corePages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },

    {
      url: `${BASE_URL}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },

    {
      url: `${BASE_URL}/online-auctions-south-africa`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
  ];

  return [
    ...corePages,
    ...categoryPages,
    ...equipmentPages,
  ];
}