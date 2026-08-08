import type { Metadata } from "next";
import connectDB from "@/lib/mongodb";
import Equipment from "@/models/Equipment";

export async function generateEquipmentMetadata(
  slug: string
): Promise<Metadata> {
  await connectDB();

  const item = await Equipment.findOne({ slug }).lean();

  if (!item) {
    return {
      title: "Equipment Not Found | NEWTA Commercial Sales",
    };
  }

  const image =
    item.images?.find((img: any) => img.cover)?.url ||
    item.images?.[0]?.url;

  return {
    title: `${item.title} | NEWTA Commercial Sales`,

    description: `${item.year} ${item.title} for sale in ${item.province}. View specifications, images and pricing from NEWTA Commercial Sales.`,

    alternates: {
      canonical: `/equipment/${item.slug}`,
    },

    openGraph: {
      title: item.title,
      description: item.description,
      url: `https://newtacommercialsales.com/equipment/${item.slug}`,
      images: image ? [{ url: image }] : [],
    },

    twitter: {
      card: "summary_large_image",
      title: item.title,
      description: item.description,
      images: image ? [image] : [],
    },
  };
}