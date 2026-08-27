import type { Metadata } from "next";
import Link from "next/link";

import connectDB from "@/lib/mongodb";
import Equipment from "@/models/Equipment";
import { equipmentCategories } from "@/app/data/categories";

import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import EquipmentCard from "../../components/EquipmentCard";

const pageUrl =
  "https://newtacommercialsales.com/equipment/dropside tipper-trailers-for-sale-south-africa";

export const metadata: Metadata = {
  title: "Dropside Tipper Trailers for Sale South Africa | NEWTA Commercial Sales",

  description:
    "Dropside Tipper trailers for sale in South Africa through NEWTA Commercial Sales. Browse available Dropside Tipper trailers are used for transporting building materials, agricultural products, machinery, equipment and general freight.",

  alternates: {
    canonical: pageUrl,
  },

  openGraph: {
    title: "Dropside Tipper Trailers for Sale South Africa | NEWTA Commercial Sales",

    description:
      "Browse Dropside Tipper trailers for sale through NEWTA Commercial Sales.",

    url: pageUrl,

    type: "website",

    siteName: "NEWTA Commercial Sales",

    locale: "en_ZA",
  },

  twitter: {
    card: "summary_large_image",

    title: "Dropside Tipper Trailers for Sale South Africa | NEWTA Commercial Sales",

    description:
      "Browse available Dropside Tipper trailers through NEWTA Commercial Sales.",
  },
};

export default async function DropsideTipperTrailersForSalePage() {
  await connectDB();

  const commercialVehicles = equipmentCategories.find(
    (category) => category.slug === "commercial-vehicles"
  );

  const trailers = commercialVehicles?.subcategories.find(
    (subcategory) => subcategory.slug === "trailers"
  );

  /*
   * Dropside Tipper trailers may eventually have their own category in
   * categories.ts. Until then, this page uses the existing Trailers
   * category and filters the available listings by trailer title/type.
   */
  const equipment = await Equipment.find({
    category: commercialVehicles?.name,
    subcategory: trailers?.name,
    status: "Available",
  })
    .sort({ createdAt: -1 })
    .lean();

  const DropsideTipperEquipment = equipment.filter((item: any) => {
    const searchableText = [
      item.title,
      item.description,
      item.make,
      item.model,
      item.type,
      item.subcategory,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    return searchableText.includes("Dropside tipper");
  });

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",

    name: "Dropside Tipper Trailers for Sale South Africa",

    description:
      "Dropside Tipper trailers for sale through NEWTA Commercial Sales.",

    url: pageUrl,

    isPartOf: {
      "@type": "WebSite",
      name: "NEWTA Commercial Sales",
      url: "https://newtacommercialsales.com",
    },

    about: {
      "@type": "Thing",
      name: "Dropside Tipper Trailers",
    },

    mainEntity: {
      "@type": "ItemList",

      numberOfItems: DropsideTipperEquipment.length,

      itemListElement: DropsideTipperEquipment.map((item: any, index: number) => ({
        "@type": "ListItem",

        position: index + 1,

        name: item.title,

        url: `https://newtacommercialsales.com/equipment/${item.slug}`,
      })),
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />

      <Navbar />

      <main className="min-h-screen bg-[#FAF8F2]">
        {/* HERO */}
        <section className="bg-gradient-to-r from-green-950 via-green-900 to-green-800 text-white">
          <div className="mx-auto max-w-7xl px-6 py-20">
            <nav
              aria-label="Breadcrumb"
              className="mb-8 text-sm text-gray-300"
            >
              <Link href="/" className="hover:text-[#D4AF37]">
                Home
              </Link>

              <span className="mx-2">/</span>

              <Link
                href="/equipment"
                className="hover:text-[#D4AF37]"
              >
                Equipment
              </Link>

              <span className="mx-2">/</span>

              <Link
                href="/equipment/trailers-for-sale-south-africa"
                className="hover:text-[#D4AF37]"
              >
                Trailers
              </Link>

              <span className="mx-2">/</span>

              <span className="text-[#D4AF37]">
                Dropside Tipper Trailers
              </span>
            </nav>

            <span className="inline-block rounded-full bg-[#D4AF37] px-5 py-2 text-sm font-bold uppercase tracking-wider text-[#0B2F24]">
              Private Treaty Sales
            </span>

            <h1 className="mt-6 max-w-5xl text-4xl font-extrabold leading-tight md:text-6xl">
              Dropside Tipper Trailers for Sale South Africa
            </h1>

            <p className="mt-6 max-w-4xl text-lg leading-8 text-gray-200 md:text-xl">
              Browse Dropside Tipper trailers for sale through NEWTA
              Commercial Sales. Dropside Tippers are used for transporting  building materials,
              agricultural products, machinery, equipment and general freight.
            </p>
          </div>
        </section>

        {/* INTRODUCTION */}
        <section className="mx-auto max-w-7xl px-6 py-16">
          <div className="max-w-4xl">
            <h2 className="text-3xl font-bold text-[#0B2F24] md:text-4xl">
              Dropside Tipper Trailers for Sale
            </h2>

            <p className="mt-5 text-lg leading-8 text-gray-600">
              Dropside trailers are practical commercial trailers with side
              boards that help contain and secure a wide range of loads while
              providing access from the sides for loading and unloading. They
              are commonly used for transporting building materials,
              agricultural products, machinery, equipment and general freight.
            </p>

            <p className="mt-5 text-lg leading-8 text-gray-600">
              Dropside trailers can be used across construction, agriculture,
              logistics and general commercial transport. The exact trailer
              dimensions, payload, body configuration and specifications depend
              on the individual trailer.
            </p>

            </div>

          {/* COMMON USES */}
          <div className="mt-14">
            <h2 className="text-3xl font-bold text-[#0B2F24]">
              Common Uses for Dropside Tipper Trailers
            </h2>

            <p className="mt-4 max-w-3xl text-lg leading-8 text-gray-600">
              Dropside Tipper trailers can be used across construction,
              agriculture, and general commercial transport applications.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[
               "Building materials",
               "Agricultural products",
               "Machinery and equipment",
               "General freight",
               "Palletised goods",
               "Commercial deliveries",
               ].map((use) => (
                <div
                  key={use}
                  className="rounded-2xl border bg-white p-6 shadow-sm"
                >
                  <div className="flex items-start gap-3">
                    <span className="mt-1 text-[#D4AF37]">✓</span>

                    <span className="font-semibold text-[#0B2F24]">
                      {use}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* TRAILER CONFIGURATIONS */}
        <section className="border-y bg-white">
          <div className="mx-auto max-w-7xl px-6 py-16">
            <div className="max-w-4xl">
              <h2 className="text-3xl font-bold text-[#0B2F24] md:text-4xl">
                Dropside Tipper Trailer Configurations
              </h2>

              <p className="mt-5 text-lg leading-8 text-gray-600">
                Dropside Tipper trailers are available in different
                configurations depending on the intended application,
                load requirements and trailer design. NEWTA listings
                provide the specific dimensions and configuration of
                each asset.
              </p>
            </div>

            <div className="mt-10 grid gap-6 md:grid-cols-2">
              <div className="rounded-2xl border bg-[#FAF8F2] p-7 shadow-sm">
                <h3 className="text-2xl font-bold text-[#0B2F24]">
                  Dropside Tipper Trailers
                </h3>

                <p className="mt-4 leading-7 text-gray-600">
                  They are commonly used for transporting building materials,
              agricultural products, machinery, equipment and general freight.
                </p>
              </div>

              <div className="rounded-2xl border bg-[#FAF8F2] p-7 shadow-sm">
                <h3 className="text-2xl font-bold text-[#0B2F24]">
                  Dropside Tipper Trailers
                </h3>

                <p className="mt-4 leading-7 text-gray-600">
                 Dropside trailers are available in different tonnages
                </p>

                                
              </div>
            </div>
          </div>
        </section>

        {/* LISTINGS */}
        <section className="mx-auto max-w-7xl px-6 py-16">
          <div className="max-w-4xl">
            <h2 className="text-3xl font-bold text-[#0B2F24] md:text-4xl">
              Dropside Tipper Trailers Currently Available
            </h2>

            <p className="mt-4 text-lg leading-8 text-gray-600">
              Browse current NEWTA Commercial Sales listings below.
              Each listing includes available photographs,
              specifications, pricing and enquiry information.
            </p>
          </div>

          {DropsideTipperEquipment.length > 0 ? (
            <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {DropsideTipperEquipment.map((item: any) => (
                <EquipmentCard
                  key={item._id.toString()}
                  id={item.slug}
                  slug={item.slug}
                  image={
                    item.images?.length
                      ? item.images.find(
                          (img: any) => img.cover
                        )?.url ?? item.images[0].url
                      : "/placeholder-equipment.jpg"
                  }
                  title={item.title}
                  year={item.year}
                  status={item.status}
                  price={`${item.currency ?? "ZAR"} ${item.price}`}
                  hours={item.kmHours}
                  location={item.province}
                />
              ))}
            </div>
          ) : (
            <div className="mt-12 rounded-2xl border bg-white p-10 text-center shadow-sm">
              <h2 className="text-2xl font-bold text-[#0B2F24]">
                No Dropside Tipper trailers currently available
              </h2>

              <p className="mt-3 text-gray-600">
                Please check back soon for new Dropside Tipper trailer
                listings.
              </p>

              <Link
                href="/equipment/trailers-for-sale-south-africa"
                className="mt-6 inline-block rounded-xl bg-[#D4AF37] px-6 py-3 font-bold text-[#0B2F24]"
              >
                View All Trailers
              </Link>
            </div>
          )}
        </section>

        {/* RELATED TRAILER TYPES */}
        <section className="bg-[#FAF8F2]">
          <div className="mx-auto max-w-7xl px-6 py-16">
            <h2 className="text-3xl font-bold text-[#0B2F24] md:text-4xl">
              Other Trailer Types
            </h2>

            <p className="mt-4 max-w-3xl text-lg leading-8 text-gray-600">
              Explore other commercial trailer categories available
              through NEWTA Commercial Sales.
            </p>

            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              <Link
                href="/equipment/trailers-for-sale-south-africa"
                className="rounded-2xl border bg-white p-6 font-bold text-[#0B2F24] shadow-sm transition hover:-translate-y-1 hover:border-[#D4AF37]"
              >
                All Trailers →
              </Link>

              <Link
                href="/equipment/Dropside Tipper-trailers-for-sale-south-africa"
                className="rounded-2xl border bg-white p-6 font-bold text-[#0B2F24] shadow-sm transition hover:-translate-y-1 hover:border-[#D4AF37]"
              >
                Flatdeck Trailers →
              </Link>

              <Link
                href="/equipment/side-tipper-trailers-for-sale-south-africa"
                className="rounded-2xl border bg-white p-6 font-bold text-[#0B2F24] shadow-sm transition hover:-translate-y-1 hover:border-[#D4AF37]"
              >
                Side Tipper Trailers →
              </Link>

              <Link
                href="/equipment/dropside-trailers-for-sale-south-africa"
                className="rounded-2xl border bg-white p-6 font-bold text-[#0B2F24] shadow-sm transition hover:-translate-y-1 hover:border-[#D4AF37]"
              >
                Backend Tipper Trailers →
              </Link>
            </div>
          </div>
        </section>

        {/* INFORMATION */}
        <section className="border-t bg-white">
          <div className="mx-auto max-w-7xl px-6 py-16">
            <div className="grid gap-8 md:grid-cols-3">
              <div className="rounded-2xl border p-6 shadow-sm">
                <h3 className="text-xl font-bold text-[#0B2F24]">
                  Dropside tipper trailers
                </h3>

                <p className="mt-3 leading-7 text-gray-600">
                  Dropside tipping trailers are available in different tonnages.
                  building materials, agricultural products, machinery, 
                  equipment and general freight.
                </p>
              </div>

              <div className="rounded-2xl border p-6 shadow-sm">
                <h3 className="text-xl font-bold text-[#0B2F24]">
                  Multiple Configurations
                </h3>

                <p className="mt-3 leading-7 text-gray-600">
                  Dropside Tipper trailers can be found in different
                  configurations and dimensions. Check each NEWTA
                  listing for the exact specification.
                </p>
              </div>

              <div className="rounded-2xl border p-6 shadow-sm">
                <h3 className="text-xl font-bold text-[#0B2F24]">
                  Private Treaty Sales
                </h3>

                <p className="mt-3 leading-7 text-gray-600">
                  Contact NEWTA Commercial Sales directly about an
                  available Dropside Tipper trailer or another commercial
                  asset.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-[#0B2F24] text-white">
          <div className="mx-auto max-w-7xl px-6 py-16 text-center">
            <h2 className="text-3xl font-bold md:text-4xl">
              Looking for a Dropside Tipper Trailer?
            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-300">
              Contact NEWTA Commercial Sales if you are looking for a
              particular Dropside Tipper trailer or want more information
              about an available asset.
            </p>

            <Link
              href="/contact"
              className="mt-8 inline-block rounded-xl bg-[#D4AF37] px-8 py-4 font-bold text-[#0B2F24] shadow-lg transition hover:bg-[#C89B2C]"
            >
              Contact NEWTA
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}