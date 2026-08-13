import connectDB from "@/lib/mongodb";
import Equipment from "@/models/Equipment";

const SITE_URL = "https://newtacommercialsales.com";

export async function generateStructuredData(slug: string) {
  await connectDB();

  const item = await Equipment.findOne({ slug }).lean();

  if (!item) {
    return null;
  }

  const canonicalUrl = `${SITE_URL}/equipment/${item.slug}`;

  const images =
  item.images
    ?.map((image: any) => {
      if (!image.url) return null;

      return image.url.startsWith("http")
        ? image.url
        : `${SITE_URL}${image.url}`;
    })
    .filter(Boolean) || [];

  const numericPrice = item.price
    ? item.price.replace(/[^\d.]/g, "")
    : "";

  const structuredData: Record<string, any> = {
    "@context": "https://schema.org",
    "@type": "Product",

    name: item.title,

    description:
      item.description ||
      `${item.title} for sale from NEWTA Commercial Sales in South Africa.`,

    image: images,

    url: canonicalUrl,

    sku: item.referenceNumber,

    category:
      item.category ||
      "Commercial Vehicles, Machinery, Plant, Industrial Equipment & Business Assets",

    brand: item.manufacturer
      ? {
          "@type": "Brand",
          name: item.manufacturer,
        }
      : undefined,

    manufacturer: item.manufacturer
      ? {
          "@type": "Organization",
          name: item.manufacturer,
        }
      : undefined,

    offers: {
      "@type": "Offer",

      priceCurrency: item.currency || "ZAR",

      availability:
        item.status === "Available"
          ? "https://schema.org/InStock"
          : "https://schema.org/SoldOut",

      url: canonicalUrl,

      seller: {
        "@type": "Organization",
        name: "NEWTA Commercial Sales",
        url: SITE_URL,
      },
    },
  };

  // Only add a price when the listing has an actual numeric price.
  // This prevents "POA" from being incorrectly sent to Google as a price.
  if (numericPrice) {
    structuredData.offers.price = numericPrice;
  }

  return structuredData;
}