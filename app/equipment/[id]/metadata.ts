import type { Metadata } from "next";
import { equipment } from "../../data/equipment";

export async function generateEquipmentMetadata(
  id: string
): Promise<Metadata> {
  const item = equipment.find((e) => e.id === id);

  if (!item) {
    return {
      title: "Equipment Not Found | NEWTA Commercial Sales",
    };
  }

  return {
    title: `${item.title} | NEWTA Commercial Sales`,

    description: `${item.year} ${item.title} for sale in ${item.location}. ${item.hours} hours. View images, technical specifications and pricing from NEWTA Commercial Sales. Private Treaty Sales throughout South Africa.`,

    alternates: {
      canonical: `/equipment/${item.id}`,
    },

    openGraph: {
      title: `${item.title} | NEWTA Commercial Sales`,
      description: `${item.year} ${item.title} available from NEWTA Commercial Sales in ${item.location}.`,
      url: `https://newtacommercialsales.com/equipment/${item.id}`,
      type: "website",
      siteName: "NEWTA Commercial Sales",
      locale: "en_ZA",
      images: [
        {
          url: item.images[0],
          width: 1200,
          height: 630,
          alt: item.title,
        },
      ],
    },

    twitter: {
      card: "summary_large_image",
      title: `${item.title} | NEWTA Commercial Sales`,
      description: `${item.year} ${item.title} available from NEWTA Commercial Sales.`,
      images: [item.images[0]],
    },
  };
}