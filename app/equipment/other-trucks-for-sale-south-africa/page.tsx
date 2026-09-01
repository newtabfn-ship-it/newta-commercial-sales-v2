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
    "Other Trucks for Sale South Africa | NEWTA Commercial Sales",

  description:
    "Browse other trucks for sale in South Africa through NEWTA Commercial Sales. Find commercial trucks used for transport, construction, agriculture, industrial work and specialised applications.",

  alternates: {
    canonical:
      "https://newtacommercialsales.com/equipment/other-trucks-for-sale-south-africa",
  },

  openGraph: {
    title:
      "Other Trucks for Sale South Africa | NEWTA Commercial Sales",

    description:
      "Browse other commercial trucks currently available through NEWTA Commercial Sales across South Africa.",

    url:
      "https://newtacommercialsales.com/equipment/other-trucks-for-sale-south-africa",

    type: "website",

    siteName: "NEWTA Commercial Sales",

    locale: "en_ZA",
  },

  twitter: {
    card: "summary_large_image",

    title:
      "Other Trucks for Sale South Africa | NEWTA Commercial Sales",

    description:
      "Browse available other trucks through NEWTA Commercial Sales.",
  },
};

export default async function OtherTrucksForSalePage() {
  await connectDB();

  const commercialVehicles = equipmentCategories.find(
    (category) => category.slug === "commercial-vehicles"
  );

  const otherTrucks = commercialVehicles?.subcategories.find(
    (subcategory) => subcategory.slug === "other-trucks"
  );

  const equipment = await Equipment.find({
    category: commercialVehicles?.name,
    subcategory: otherTrucks?.name,
    status: "Available",
  })
    .sort({ createdAt: -1 })
    .lean();

  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",

        name: "Other Trucks for Sale South Africa",

        description:
          "Other trucks for sale in South Africa through NEWTA Commercial Sales, including commercial truck configurations used for transport, construction, agriculture, industrial work and specialised applications.",

        url:
          "https://newtacommercialsales.com/equipment/other-trucks-for-sale-south-africa",

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
            name: "Other Trucks for Sale South Africa",
            item:
              "https://newtacommercialsales.com/equipment/other-trucks-for-sale-south-africa",
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
                Other Trucks
              </span>
            </nav>

            <span className="inline-block rounded-full bg-[#D4AF37] px-5 py-2 text-sm font-bold uppercase tracking-wider text-[#0B2F24]">
              Private Treaty Sales
            </span>

            <h1 className="mt-6 max-w-5xl text-4xl font-extrabold leading-tight md:text-6xl">
              Other Trucks for Sale South Africa
            </h1>

            <p className="mt-6 max-w-4xl text-lg leading-8 text-gray-200 md:text-xl">
              Browse other commercial trucks for sale across South Africa
              through NEWTA Commercial Sales. This category covers truck
              configurations that do not fall into the dedicated dropside,
              flatdeck, crane truck, cement mixer truck or truck tractor
              categories.
            </p>

          </div>

        </section>

        {/* INTRODUCTION */}

        <section className="mx-auto max-w-7xl px-6 py-16">

          <div className="max-w-4xl">

            <h2 className="text-3xl font-bold text-[#0B2F24] md:text-4xl">
              Other Commercial Trucks for Sale
            </h2>

            <p className="mt-5 text-lg leading-8 text-gray-600">
              NEWTA Commercial Sales offers a wide range of commercial
              vehicles through Private Treaty Sales across South Africa.
              The Other Trucks category provides a place for commercial
              truck configurations that are not covered by the dedicated
              truck body and vehicle categories.
            </p>

            <p className="mt-5 text-lg leading-8 text-gray-600">
              These trucks can be used for transport, construction,
              agriculture, industrial operations, deliveries, material
              handling and other commercial applications. The type of
              truck, body configuration, carrying capacity and
              specifications will vary according to the individual asset.
            </p>

            <p className="mt-5 text-lg leading-8 text-gray-600">
              Browse the current NEWTA listings below to view
              photographs, specifications, pricing, location and
              enquiry information.
            </p>

          </div>

        </section>

        {/* APPLICATIONS */}

        <section className="border-t bg-white">

          <div className="mx-auto max-w-7xl px-6 py-16">

            <h2 className="text-3xl font-bold text-[#0B2F24] md:text-4xl">
              Commercial Truck Applications
            </h2>

            <p className="mt-4 max-w-4xl text-lg leading-8 text-gray-600">
              Commercial trucks are used across many industries in
              South Africa. Applications depend on the individual
              truck, body configuration, load requirements and
              operating environment.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

              {[
                "General freight",
                "Local and regional transport",
                "Construction work",
                "Agricultural transport",
                "Industrial transport",
                "Material handling",
                "Commercial deliveries",
                "Specialised transport",
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
              Other Trucks Currently for Sale
            </h2>

            <p className="mt-4 text-lg leading-8 text-gray-600">
              View other commercial trucks currently available through
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
                No Other Trucks currently available
              </h2>

              <p className="mt-3 text-gray-600">
                Please check back soon for new commercial truck
                listings.
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
                  Commercial Trucks
                </h3>

                <p className="mt-3 text-gray-600">
                  Browse commercial truck assets used for transport,
                  construction, agriculture, industry and other
                  business applications.
                </p>

              </div>

              <div className="rounded-2xl border p-6 shadow-sm">

                <h3 className="text-xl font-bold text-[#0B2F24]">
                  South African Applications
                </h3>

                <p className="mt-3 text-gray-600">
                  Truck specifications and applications vary according
                  to the individual vehicle and the requirements of
                  the operation.
                </p>

              </div>

              <div className="rounded-2xl border p-6 shadow-sm">

                <h3 className="text-xl font-bold text-[#0B2F24]">
                  Enquire About an Asset
                </h3>

                <p className="mt-3 text-gray-600">
                  Select an available truck to view its full details
                  or contact NEWTA Commercial Sales directly.
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
              Browse the full NEWTA truck inventory, including
              dropside trucks, flatdeck trucks, crane trucks, cement
              mixer trucks, truck tractors and trucks by tonnage.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">

              <Link
                href="/equipment/trucks-for-sale-south-africa"
                className="rounded-xl bg-[#0B2F24] px-6 py-3 font-bold text-white transition hover:bg-green-900"
              >
                Trucks for Sale
              </Link>

              <Link
                href="/equipment/dropside-trucks-for-sale-south-africa"
                className="rounded-xl bg-[#0B2F24] px-6 py-3 font-bold text-white transition hover:bg-green-900"
              >
                Dropside Trucks
              </Link>

              <Link
                href="/equipment/flatdeck-trucks-for-sale-south-africa"
                className="rounded-xl bg-[#0B2F24] px-6 py-3 font-bold text-white transition hover:bg-green-900"
              >
                Flatdeck Trucks
              </Link>

              <Link
                href="/equipment/crane-trucks-for-sale-south-africa"
                className="rounded-xl bg-[#0B2F24] px-6 py-3 font-bold text-white transition hover:bg-green-900"
              >
                Crane Trucks
              </Link>

              <Link
                href="/equipment/truck-tractors-for-sale-south-africa"
                className="rounded-xl bg-[#0B2F24] px-6 py-3 font-bold text-white transition hover:bg-green-900"
              >
                Truck Tractors
              </Link>

            </div>

          </div>

        </section>

        {/* CTA */}

        <section className="bg-[#0B2F24] text-white">

          <div className="mx-auto max-w-7xl px-6 py-16 text-center">

            <h2 className="text-3xl font-bold md:text-4xl">
              Looking for a Specific Truck?
            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-lg leading-8 text-gray-300">
              Contact NEWTA Commercial Sales if you are looking for
              a particular truck or want more information about an
              available commercial asset.
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