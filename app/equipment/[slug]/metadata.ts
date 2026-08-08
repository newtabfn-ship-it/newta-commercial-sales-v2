import type { Metadata } from "next";
import connectDB from "@/lib/mongodb";
import Equipment from "@/models/Equipment";

const SITE_URL = "https://newtacommercialsales.com";

export async function generateEquipmentMetadata(
  slug: string
): Promise<Metadata> {
  await connectDB();

  const item = await Equipment.findOne({ slug }).lean();

  if (!item) {
    return {
      title: "Equipment Not Found | NEWTA Commercial Sales",
      description:
        "The commercial vehicle, machinery or asset you are looking for could not be found.",
      robots: {
        index: false,
        follow: true,
      },
    };
  }

  const title = `${item.title} | NEWTA Commercial Sales`;

  const description =
    `${item.year ? `${item.year} ` : ""}${item.title} for sale` +
    `${item.province ? ` in ${item.province}, South Africa` : " in South Africa"}. ` +
    `View specifications, images and enquire online with NEWTA Commercial Sales.`;

  const coverImage =
    item.images?.find((image: any) => image.cover)?.url ||
    item.images?.[0]?.url;

  const imageUrl = coverImage
    ? coverImage.startsWith("http")
      ? coverImage
      : `${SITE_URL}${coverImage}`
    : `${SITE_URL}/og-image.png`;

  const canonicalUrl = `${SITE_URL}/equipment/${item.slug}`;

  return {
    title,

    description,

    keywords: [
      item.title,
      item.manufacturer,
      item.model,
      item.category,
      item.province,
      "for sale",
      "South Africa",
      "NEWTA Commercial Sales",
    ].filter(Boolean),

    alternates: {
      canonical: canonicalUrl,
    },

    openGraph: {
      type: "website",
      locale: "en_ZA",
      url: canonicalUrl,
      siteName: "NEWTA Commercial Sales",
      title,
      description,

      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: item.title,
        },
      ],
    },

    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },

    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
  };
}