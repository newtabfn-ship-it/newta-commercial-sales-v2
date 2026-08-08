import connectDB from "@/lib/mongodb";
import Equipment from "@/models/Equipment";

export async function generateStructuredData(
  slug: string
) {
  await connectDB();

  const item = await Equipment.findOne({ slug }).lean();

  if (!item) return null;

  const numericPrice =
    item.price?.replace(/[^\d.]/g, "") || "";

  return {
    "@context": "https://schema.org",
    "@type": "Product",

    name: item.title,

    image: item.images?.map(
      (img: any) => img.url
    ),

    description: item.description,

    sku: item.serialNumber,

    brand: {
      "@type": "Brand",
      name: item.manufacturer,
    },

    offers: {
      "@type": "Offer",

      ...(numericPrice && {
        price: numericPrice,
      }),

      priceCurrency: item.currency || "ZAR",

      availability:
        item.status === "Available"
          ? "https://schema.org/InStock"
          : "https://schema.org/SoldOut",

      url: `https://newtacommercialsales.com/equipment/${item.slug}`,
    },
  };
}