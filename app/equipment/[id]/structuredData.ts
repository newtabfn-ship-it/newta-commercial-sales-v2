import { equipment } from "../../data/equipment";

export function generateStructuredData(id: string) {
  const item = equipment.find((e) => e.id === id);

  if (!item) return null;

  const numericPrice = item.price.replace(/[^\d.]/g, "");

  return {
    "@context": "https://schema.org",
    "@type": "Product",

    name: item.title,

    image: item.images.map(
      (image) => `https://newtacommercialsales.com${image}`
    ),

    description: item.description,

    sku: item.serialNumber,

    category:
      "Commercial Vehicles, Machinery, Plant, Industrial Equipment & Business Assets",

    brand: {
      "@type": "Brand",
      name: item.manufacturer,
    },

    manufacturer: {
      "@type": "Organization",
      name: item.manufacturer,
    },

    offers: {
      "@type": "Offer",

      ...(numericPrice && { price: numericPrice }),

      priceCurrency: "ZAR",

      availability:
        item.status.toLowerCase() === "available"
          ? "https://schema.org/InStock"
          : "https://schema.org/SoldOut",

      url: `https://newtacommercialsales.com/equipment/${item.id}`,

      seller: {
        "@type": "Organization",
        name: "NEWTA Commercial Sales",
      },
    },
  };
}