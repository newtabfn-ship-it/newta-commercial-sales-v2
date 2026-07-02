import type { Metadata } from "next";
import { GoogleAnalytics } from "@next/third-parties/google";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://newtacommercialsales.com"),

  title: {
    default: "NEWTA Commercial Sales | Commercial & Industrial Equipment",
    template: "%s | NEWTA Commercial Sales",
  },

  description:
    "NEWTA Commercial Sales specialises in commercial equipment, earthmoving machinery, asset liquidations and private treaty sales across South Africa.",

  keywords: [
    "Commercial Equipment South Africa",
    "Commercial Vehicles South Africa",
    "Used Trucks",
    "Used Bakkies",
    "Trailers",
    "Earthmoving Equipment",
    "Construction Equipment",
    "Agricultural Equipment",
    "Mining Equipment",
    "Industrial Equipment",
    "Plant Machinery",
    "Business Assets",
    "Private Treaty Sales",
    "Komatsu",
    "CAT",
    "Bell Equipment",
    "Bloemfontein",
    "Free State",
    "South Africa",
  ],

  authors: [
    {
      name: "NEWTA Commercial Sales",
    },
  ],

  creator: "NEWTA Commercial Sales",

  publisher: "NEWTA Commercial Sales",

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

  alternates: {
    canonical: "/",
  },

  openGraph: {
    type: "website",
    locale: "en_ZA",
    url: "https://newtacommercialsales.com",
    siteName: "NEWTA Commercial Sales",
    title: "NEWTA Commercial Sales",
    description:
      "Commercial vehicles, machinery, plant, industrial equipment and private treaty sales throughout South Africa.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "NEWTA Commercial Sales",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "NEWTA Commercial Sales",
    description:
      "Commercial vehicles, machinery, plant, industrial equipment, trucks, trailers, spares and business assets throughout South Africa.",
    images: ["/og-image.png"],
  },

  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-ZA">
      <body>
        {children}
      </body>

      <GoogleAnalytics gaId="G-R1NQRK458K" />
    </html>
  );
}