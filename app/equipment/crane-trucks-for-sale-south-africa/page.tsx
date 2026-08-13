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
    "Crane Trucks for Sale South Africa | NEWTA Commercial Sales",

  description:
    "Browse crane trucks for sale in South Africa through NEWTA Commercial Sales. View available truck-mounted cranes, specifications, images, pricing and enquiry information.",

  alternates: {
    canonical:
      "https://newtacommercialsales.com/equipment/crane-trucks-for-sale-south-africa",
  },

  openGraph: {
    title:
      "Crane Trucks for Sale South Africa | NEWTA Commercial Sales",

    description:
      "Browse crane trucks currently available through NEWTA Commercial Sales across South Africa.",

    url:
      "https://newtacommercialsales.com/equipment/crane-trucks-for-sale-south-africa",

    type: "website",

    siteName: "NEWTA Commercial Sales",

    locale: "en_ZA",
  },

  twitter: {
    card: "summary_large_image",

    title:
      "Crane Trucks for Sale South Africa | NEWTA Commercial Sales",

    description:
      "Browse available crane trucks through NEWTA Commercial Sales.",
  },
};

export default async function CraneTrucksPage() {
  await connectDB();

  const commercialVehicles = equipmentCategories.find(
  (category) => category.slug === "commercial-vehicles"
);

const craneTrucks = commercialVehicles?.subcategories.find(
  (subcategory) => subcategory.slug === "crane-trucks"
);

const equipment = await Equipment.find({
  category: commercialVehicles?.name,
  subcategory: craneTrucks?.name,
  status: "Available",
})
  .sort({ createdAt: -1 })
  .lean();

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",

    name: "Crane Trucks for Sale South Africa",

    description:
      "Crane trucks for sale through NEWTA Commercial Sales.",

    url:
      "https://newtacommercialsales.com/equipment/crane-trucks-for-sale-south-africa",

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
                Crane Trucks
              </span>
            </nav>

            <span className="inline-block rounded-full bg-[#D4AF37] px-5 py-2 text-sm font-bold uppercase tracking-wider text-[#0B2F24]">
              Private Treaty Sales
            </span>

            <h1 className="mt-6 max-w-5xl text-4xl font-extrabold leading-tight md:text-6xl">
              Crane Trucks for Sale South Africa
            </h1>

            <p className="mt-6 max-w-4xl text-lg leading-8 text-gray-200 md:text-xl">
              Browse crane trucks currently available through NEWTA
              Commercial Sales. View truck-mounted cranes, hydraulic
              crane trucks and other commercial lifting vehicles with
              photographs, specifications and enquiry information.
            </p>

          </div>

        </section>

        {/* INTRODUCTION */}

        <section className="mx-auto max-w-7xl px-6 py-16">

          <div className="max-w-4xl">

            <h2 className="text-3xl font-bold text-[#0B2F24] md:text-4xl">
              Crane Trucks for Sale
            </h2>

            <p className="mt-5 text-lg leading-8 text-gray-600">
              NEWTA Commercial Sales offers commercial vehicles,
              machinery and industrial assets through Private Treaty
              Sales. Browse our current crane truck inventory below
              for available assets, photographs, specifications and
              pricing information.
            </p>

            <p className="mt-5 text-lg leading-8 text-gray-600">
              Select a crane truck to view its full listing and submit
              an enquiry directly to NEWTA Commercial Sales.
            </p>

          </div>

          {/* LISTINGS */}

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
                No crane trucks currently available
              </h2>

              <p className="mt-3 text-gray-600">
                Please check back soon for new crane truck listings.
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

        {/* BUYER INFORMATION */}

        <section className="border-t bg-white">

          <div className="mx-auto max-w-7xl px-6 py-16">

            <div className="grid gap-8 md:grid-cols-3">

              <div className="rounded-2xl border p-6 shadow-sm">

                <h3 className="text-xl font-bold text-[#0B2F24]">
                  Truck-Mounted Cranes
                </h3>

                <p className="mt-3 text-gray-600">
                  Browse commercial trucks fitted with cranes and
                  hydraulic lifting equipment.
                </p>

              </div>

              <div className="rounded-2xl border p-6 shadow-sm">

                <h3 className="text-xl font-bold text-[#0B2F24]">
                  Private Treaty Sales
                </h3>

                <p className="mt-3 text-gray-600">
                  NEWTA Commercial Sales specialises in straightforward
                  Private Treaty Sales of commercial vehicles,
                  machinery and industrial assets.
                </p>

              </div>

              <div className="rounded-2xl border p-6 shadow-sm">

                <h3 className="text-xl font-bold text-[#0B2F24]">
                  Enquire About an Asset
                </h3>

                <p className="mt-3 text-gray-600">
                  Select an available crane truck to view its full
                  details or contact NEWTA Commercial Sales directly.
                </p>

              </div>

            </div>

          </div>

        </section>

        {/* RELATED TRUCKS */}

        <section className="bg-[#FAF8F2]">

          <div className="mx-auto max-w-7xl px-6 py-16">

            <h2 className="text-3xl font-bold text-[#0B2F24]">
              More Commercial Trucks
            </h2>

            <p className="mt-4 max-w-3xl text-lg text-gray-600">
              Looking for another type of commercial truck? Browse
              the full NEWTA truck inventory.
            </p>

            <Link
              href="/equipment/trucks-for-sale-south-africa"
              className="mt-6 inline-block rounded-xl bg-[#0B2F24] px-7 py-3 font-bold text-white transition hover:bg-green-900"
            >
              View Trucks for Sale →
            </Link>

          </div>

        </section>

        {/* CTA */}

        <section className="bg-[#0B2F24] text-white">

          <div className="mx-auto max-w-7xl px-6 py-16 text-center">

            <h2 className="text-3xl font-bold md:text-4xl">
              Looking for a Crane Truck?
            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-300">
              Contact NEWTA Commercial Sales if you are looking for
              a particular crane truck or want more information about
              an available asset.
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