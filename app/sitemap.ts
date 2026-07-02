import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
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
      url: "https://newtacommercialsales.com/contact",
      lastModified: new Date(),
    },
    {
      url: "https://newtacommercialsales.com/about",
      lastModified: new Date(),
    },
  ];
}