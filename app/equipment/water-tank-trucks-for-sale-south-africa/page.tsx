import type { Metadata } from "next";
import Link from "next/link";

import connectDB from "@/lib/mongodb";
import Equipment from "@/models/Equipment";
import { equipmentCategories } from "@/app/data/categories";

import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import EquipmentCard from "../../components/EquipmentCard";

export const metadata: Metadata = {
  title:
    "Water Tank Trucks for Sale South Africa",

  description:
    "Browse water tank trucks for sale in South Africa through NEWTA Commercial Sales. View available water trucks for construction, mining, agriculture, roadworks, dust suppression and commercial water transport.",

  alternates: {
    canonical:
      "https://newtacommercialsales.com/equipment/water-tank-trucks-for-sale-south-africa",
  },

  openGraph: {
    title:
      "Water Tank Trucks for Sale South Africa",

    description:
      "Browse water tank trucks currently available through NEWTA Commercial Sales across South Africa for construction, mining, agriculture, roadworks, dust suppression and commercial water transport.",


    url:
      "https://newtacommercialsales.com/equipment/water-tank-trucks-for-sale-south-africa",

    type: "website",

    siteName: "NEWTA Commercial Sales",

    locale: "en_ZA",
  },

  twitter: {
    card: "summary_large_image",

    title:
      "Water Tank Trucks for Sale South Africa",

    description:
      "Browse available water tank trucks through NEWTA Commercial Sales in South Africa.",
  },
};

export default async function WaterTankTrucksPage() {
  await connectDB();

  const commercialVehicles = equipmentCategories.find(
    (category) => category.slug === "commercial-vehicles"
  );

  const waterTankTrucks = commercialVehicles?.subcategories.find(
    (subcategory) => subcategory.slug === "water-tank-trucks"
  );

  const equipment = await Equipment.find({
    category: commercialVehicles?.name,
    subcategory: waterTankTrucks?.name,
    status: "Available",
  })
    .sort({ createdAt: -1 })
    .lean();

  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",

        name: "Water Tank Trucks for Sale South Africa",

        description:
          "Water Tank trucks and water-tank trucks for sale in South Africa through NEWTA Commercial Sales, suitable for construction, mining, agriculture, roadworks, dust suppression and commercial water transport.",

        url:
          "https://newtacommercialsales.com/equipment/water-tank-trucks-for-sale-south-africa",

        isPartOf: {
          "@type": "WebSite",
          name: "NEWTA Commercial Sales",
          url: "https://newtacommercialsales.com",
        },

        mainEntity: {
          "@type": "ItemList",

          numberOfItems: equipment.length,

          itemListElement: equipment.map((item, index) => ({
            "@type": "ListItem",

            position: index + 1,

            name: item.title,

            url: `https://newtacommercialsales.com/equipment/${item.slug}`,
          })),
        },
      },

      {
        "@type": "BreadcrumbList",

        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: "https://newtacommercialsales.com",
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Equipment",
            item: "https://newtacommercialsales.com/equipment",
          },
          {
            "@type": "ListItem",
            position: 3,
            name: "Trucks for Sale South Africa",
            item:
              "https://newtacommercialsales.com/equipment/trucks-for-sale-south-africa",
          },
          {
            "@type": "ListItem",
            position: 4,
            name: "Water Tank Trucks for Sale South Africa",
            item:
              "https://newtacommercialsales.com/equipment/water-tank-trucks-for-sale-south-africa",
          },
        ],
      },
    ],
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
              <Link
                href="/"
                className="hover:text-[#D4AF37]"
              >
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
                href="/equipment/trucks-for-sale-south-africa"
                className="hover:text-[#D4AF37]"
              >
                Trucks for Sale South Africa
              </Link>

              <span className="mx-2">/</span>

              <span className="text-[#D4AF37]">
                Water Tank Trucks
              </span>
            </nav>

            <span className="inline-block rounded-full bg-[#D4AF37] px-5 py-2 text-sm font-bold uppercase tracking-wider text-[#0B2F24]">
              Private Treaty Sales
            </span>

            <h1 className="mt-6 max-w-5xl text-4xl font-extrabold leading-tight md:text-6xl">
              Water Tank Trucks for Sale South Africa
            </h1>

            <p className="mt-6 max-w-4xl text-lg leading-8 text-gray-200 md:text-xl">
              Browse water tank trucks for sale across South Africa
              through NEWTA Commercial Sales. Find trucks suitable for
              construction, mining, agriculture, roadworks, dust suppression
              and commercial water transport.
            </p>

          </div>

        </section>

        {/* INTRODUCTION */}

        <section className="mx-auto max-w-7xl px-6 py-16">

          <div className="max-w-4xl">

            <h2 className="text-3xl font-bold text-[#0B2F24] md:text-4xl">
              Water Tank Trucks for Sale
            </h2>

            <p className="mt-5 text-lg leading-8 text-gray-600">
              NEWTA Commercial Sales offers water tank trucks and
              commercial vehicles through Private Treaty Sales across
              South Africa. Water tank trucks are commonly used where
              reliable water transport, site supply or dust suppression
              is required.
            </p>

            <p className="mt-5 text-lg leading-8 text-gray-600">
              These trucks can be used by construction companies,
              mining operations, contractors, agricultural businesses and
              other organisations involved in roadworks, dust suppression,
              site water supply and commercial water transport.
            </p>

            <p className="mt-5 text-lg leading-8 text-gray-600">
              Browse the current NEWTA Water Tank truck listings
              below to view photographs, specifications, pricing,
              location and enquiry information.
            </p>

          </div>

        </section>

        {/* APPLICATIONS */}

        <section className="border-t bg-white">

          <div className="mx-auto max-w-7xl px-6 py-16">

            <h2 className="text-3xl font-bold text-[#0B2F24] md:text-4xl">
              Water Tank Truck Applications
            </h2>

            <p className="mt-4 max-w-4xl text-lg leading-8 text-gray-600">
              Water tank trucks are used across construction, mining,
              agriculture, roadworks, dust suppression and commercial
              water transport applications.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

              {[
               "Construction water supply",
                "Dust suppression",
                "Mining operations",
                 "Agricultural water transport",
                 "Industrial water supply",
                 "Municipal applications",
                 "Site water supply",
              ].map((use) => (
                <div
                  key={use}
                  className="rounded-2xl border bg-[#FAF8F2] p-5"
                >
                  <p className="font-semibold text-[#0B2F24]">
                    {use}
                  </p>
                </div>
              ))}

            </div>

          </div>

        </section>

        {/* CURRENT LISTINGS */}

        <section className="mx-auto max-w-7xl px-6 py-16">

          <div className="max-w-4xl">

            <h2 className="text-3xl font-bold text-[#0B2F24] md:text-4xl">
              Water Tank Trucks Currently for Sale
            </h2>

            <p className="mt-4 text-lg leading-8 text-gray-600">
              View Water Tank trucks currently available through
              NEWTA Commercial Sales. Each listing includes available
              photographs, specifications, pricing, location and
              enquiry information.
            </p>

          </div>

          {equipment.length > 0 ? (

            <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">

              {equipment.map((item) => (

                <EquipmentCard
                  key={item._id.toString()}
                  id={item.slug}
                  slug={item.slug}
                  image={
                    item.images?.length
                      ? item.images.find(
                          (img: any) => img.cover
                        )?.url ??
                        item.images[0].url
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
  No water tank trucks currently available
</h2>

<p className="mt-3 text-gray-600">
  Please check back soon for new water tank truck listings.
</p>

              <Link
                href="/equipment/trucks-for-sale-south-africa"
                className="mt-6 inline-block rounded-xl bg-[#D4AF37] px-6 py-3 font-bold text-[#0B2F24]"
              >
                View All Trucks
              </Link>

            </div>

          )}

        </section>

        {/* INFORMATION */}

        <section className="border-t bg-white">

          <div className="mx-auto max-w-7xl px-6 py-16">

            <div className="grid gap-8 md:grid-cols-3">

              <div className="rounded-2xl border p-6 shadow-sm">

                <h3 className="text-xl font-bold text-[#0B2F24]">
                  Water Tank Trucks
                </h3>

                <p className="mt-3 text-gray-600">
                      Water tank trucks are used to transport and distribute
                  water for construction, mining, agriculture, roadworks,
                  dust suppression and other commercial applications.
                </p>

              </div>

              <div className="rounded-2xl border p-6 shadow-sm">

                <h3 className="text-xl font-bold text-[#0B2F24]">
                  Commercial Applications
                </h3>

                <p className="mt-3 text-gray-600">
                  Water tank trucks can support construction and mining
                  sites, agricultural operations, roadworks, dust suppression,
                  industrial sites and commercial water transport operations.
                </p>

              </div>

              <div className="rounded-2xl border p-6 shadow-sm">

                <h3 className="text-xl font-bold text-[#0B2F24]">
                  Enquire About an Asset
                </h3>

                <p className="mt-3 text-gray-600">
                  Select an available water tank truck to view its full
                  details or contact NEWTA Commercial Sales directly.
                </p>

              </div>

            </div>

          </div>

        </section>

        {/* RELATED TRUCKS */}

        <section className="bg-[#FAF8F2]">

          <div className="mx-auto max-w-7xl px-6 py-16">

            <h2 className="text-3xl font-bold text-[#0B2F24] md:text-4xl">
              More Commercial Trucks
            </h2>

            <p className="mt-4 max-w-4xl text-lg leading-8 text-gray-600">
              Looking for another type of commercial truck? Browse
              the NEWTA truck categories, including dropside trucks,
              flatdeck trucks, crane trucks, truck tractors and trucks
              by tonnage.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">

              <Link
                href="/equipment/trucks-for-sale-south-africa"
                className="rounded-xl bg-[#0B2F24] px-6 py-3 font-bold text-white transition hover:bg-green-900"
              >
                Trucks for Sale
              </Link>

              <Link
                href="/equipment/crane-trucks-for-sale-south-africa"
                className="rounded-xl bg-[#0B2F24] px-6 py-3 font-bold text-white transition hover:bg-green-900"
              >
                Crane Trucks
              </Link>

              <Link
                href="/equipment/flatdeck-trucks-for-sale-south-africa"
                className="rounded-xl bg-[#0B2F24] px-6 py-3 font-bold text-white transition hover:bg-green-900"
              >
                Flatdeck Trucks
              </Link>

              <Link
                href="/equipment/dropside-trucks-for-sale-south-africa"
                className="rounded-xl bg-[#0B2F24] px-6 py-3 font-bold text-white transition hover:bg-green-900"
              >
                Dropside Trucks
              </Link>

              <Link
                href="/equipment/truck-tractors-for-sale-south-africa"
                className="rounded-xl bg-[#0B2F24] px-6 py-3 font-bold text-white transition hover:bg-green-900"
              >
                Truck Tractors
              </Link>

              <Link
  href="/equipment/other-trucks-for-sale-south-africa"
  className="rounded-xl bg-[#0B2F24] px-6 py-3 font-bold text-white transition hover:bg-green-900"
>
  Other Trucks
</Link>

            </div>

          </div>

        </section>

        {/* CTA */}

        <section className="bg-[#0B2F24] text-white">

          <div className="mx-auto max-w-7xl px-6 py-16 text-center">

            <h2 className="text-3xl font-bold md:text-4xl">
              Looking for a Water Tank Truck?
            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-lg leading-8 text-gray-300">
              Contact NEWTA Commercial Sales if you are looking for
              a particular water tank truck or want more information
              about an available commercial asset.
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