import type { MetadataRoute } from "next";
import connectDB from "@/lib/mongodb";
import Equipment from "@/models/Equipment";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  await connectDB();

  // Only include currently available equipment.
  // Sold listings remain accessible on the website,
  // but they are not included in the sitemap.
  const equipment = await Equipment.find(
    { status: "Available" },
    "slug updatedAt"
  ).lean();

  const equipmentPages = equipment
    .filter((item) => item.slug)
    .map((item) => ({
      url: `https://newtacommercialsales.com/equipment/${item.slug}`,
      lastModified: item.updatedAt,
    }));

  return [
    {
      url: "https://newtacommercialsales.com",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },

    {
      url: "https://newtacommercialsales.com/equipment",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },

    {
      url: "https://newtacommercialsales.com/contact",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },

    {
  url: "https://newtacommercialsales.com/online-auctions-south-africa",
  lastModified: new Date(),
  changeFrequency: "weekly",
  priority: 0.9,
},

    // Commercial Vehicles
    {
      url: "https://newtacommercialsales.com/equipment/trucks-for-sale-south-africa",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },

    {
      url: "https://newtacommercialsales.com/equipment/cement-mixer-trucks-for-sale-south-africa",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },

    {
      url: "https://newtacommercialsales.com/equipment/crane-trucks-for-sale-south-africa",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },

    {
      url: "https://newtacommercialsales.com/equipment/truck-tractors-for-sale-south-africa",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },

    {
      url: "https://newtacommercialsales.com/equipment/other-trucks-for-sale-south-africa",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },

    {
      url: "https://newtacommercialsales.com/equipment/buses-for-sale-south-africa",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },

    {
      url: "https://newtacommercialsales.com/equipment/cars-for-sale-south-africa",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },

    {
      url: "https://newtacommercialsales.com/equipment/bakkies-for-sale-south-africa",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },

    {
      url: "https://newtacommercialsales.com/equipment/trailers-for-sale-south-africa",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },

    // Plant & Machinery
    {
      url: "https://newtacommercialsales.com/equipment/plant-machinery-for-sale-south-africa",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },

    {
      url: "https://newtacommercialsales.com/equipment/mobile-crushers-screening-equipment-for-sale-south-africa",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },

    {
      url: "https://newtacommercialsales.com/equipment/cranes-for-sale-south-africa",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },

    {
      url: "https://newtacommercialsales.com/equipment/construction-equipment-for-sale-south-africa",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },

    {
      url: "https://newtacommercialsales.com/equipment/agricultural-equipment-for-sale-south-africa",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },

    {
      url: "https://newtacommercialsales.com/equipment/compressors-for-sale-south-africa",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },

    {
      url: "https://newtacommercialsales.com/equipment/drilling-rigs-for-sale-south-africa",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },

    // Individual AVAILABLE listings only
    ...equipmentPages,
  ];
}