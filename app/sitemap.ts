import type { MetadataRoute } from "next";
import connectDB from "@/lib/mongodb";
import Equipment from "@/models/Equipment";

const BASE_URL = "https://newtacommercialsales.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  await connectDB();

  const equipment = await Equipment.find(
  { status: "Available" },
  "slug updatedAt"
).lean();

  const equipmentPages = equipment
    .filter((item) => item.slug)
    .map((item) => ({
      url: `${BASE_URL}/equipment/${item.slug}`,
      lastModified: item.updatedAt,
    }));

  const seoPages: MetadataRoute.Sitemap = [
    // Commercial Vehicles
    {
      url: `${BASE_URL}/equipment/trucks-for-sale-south-africa`,
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

    {
      url: `${BASE_URL}/equipment/other-trucks-for-sale-south-africa`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },

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

    {
      url: `${BASE_URL}/equipment/trailers-for-sale-south-africa`,
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

    // Drilling Rigs
    {
      url: `${BASE_URL}/equipment/drilling-rigs-for-sale-south-africa`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
  ];

  return [
    // Main pages
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },

    {
      url: `${BASE_URL}/equipment`,
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

    // SEO category pages
    ...seoPages,

    // Individual equipment listings
    ...equipmentPages,
  ];
}