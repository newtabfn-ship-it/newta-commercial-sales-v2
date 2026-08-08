import type { MetadataRoute } from "next";
import connectDB from "@/lib/mongodb";
import Equipment from "@/models/Equipment";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  await connectDB();

  const equipment = await Equipment.find({}, "slug updatedAt").lean();

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
    },
    {
      url: "https://newtacommercialsales.com/equipment",
      lastModified: new Date(),
    },
    {
      url: "https://newtacommercialsales.com/about",
      lastModified: new Date(),
    },
    {
      url: "https://newtacommercialsales.com/contact",
      lastModified: new Date(),
    },
    ...equipmentPages,
  ];
}