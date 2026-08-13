import type { Metadata } from "next";
import Link from "next/link";

import connectDB from "@/lib/mongodb";
import Equipment from "@/models/Equipment";
import { equipmentCategories } from "@/app/data/categories";

import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import EquipmentCard from "../../components/EquipmentCard";

export const metadata: Metadata = {
  title: "Trailers for Sale South Africa | NEWTA Commercial Sales",

  description:
    "Browse trailers for sale in South Africa through NEWTA Commercial Sales. View available commercial trailers, side tipper trailers, specifications, images, pricing and enquiry information.",

  alternates: {
    canonical:
      "https://newtacommercialsales.com/equipment/trailers-for-sale-south-africa",
  },

  openGraph: {
    title: "Trailers for Sale South Africa | NEWTA Commercial Sales",

    description:
      "Browse commercial trailers currently available through NEWTA Commercial Sales across South Africa.",

    url:
      "https://newtacommercialsales.com/equipment/trailers-for-sale-south-africa",

    type: "website",

    siteName: "NEWTA Commercial Sales",

    locale: "en_ZA",
  },

  twitter: {
    card: "summary_large_image",

    title: "Trailers for Sale South Africa | NEWTA Commercial Sales",

    description:
      "Browse available commercial trailers through NEWTA Commercial Sales.",
  },
};

export default async function TrailersForSalePage() {
  await connectDB();

const commercialVehicles = equipmentCategories.find(
  (category) => category.slug === "commercial-vehicles"
);

const trailers = commercialVehicles?.subcategories.find(
  (subcategory) => subcategory.slug === "trailers"
);

const equipment = await Equipment.find({
  category: commercialVehicles?.name,
  subcategory: trailers?.name,
  status: "Available",
})
  .sort({ createdAt: -1 })
  .lean();

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",

    name: "Trailers for Sale South Africa",

    description:
      "Commercial trailers for sale through NEWTA Commercial Sales.",

    url:
      "https://newtacommercialsales.com/equipment/trailers-for-sale-south-africa",

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

              <span className="text-[#D4AF37]">
                Trailers for Sale South Africa
              </span>
            </nav>

            <span className="inline-block rounded-full bg-[#D4AF37] px-5 py-2 text-sm font-bold uppercase tracking-wider text-[#0B2F24]">
              Private Treaty Sales
            </span>

            <h1 className="mt-6 max-w-5xl text-4xl font-extrabold leading-tight md:text-6xl">
              Trailers for Sale South Africa
            </h1>

            <p className="mt-6 max-w-4xl text-lg leading-8 text-gray-200 md:text-xl">
              Browse commercial trailers currently available through
              NEWTA Commercial Sales. View side tipper trailers and
              other commercial trailer assets with photographs,
              specifications, pricing and enquiry information.
            </p>

          </div>

        </section>

        {/* INTRODUCTION */}

        <section className="mx-auto max-w-7xl px-6 py-16">

          <div className="max-w-4xl">

            <h2 className="text-3xl font-bold text-[#0B2F24] md:text-4xl">
              Commercial Trailers for Sale
            </h2>

            <p className="mt-5 text-lg leading-8 text-gray-600">
              NEWTA Commercial Sales offers commercial vehicles,
              trailers, machinery and industrial assets through
              Private Treaty Sales. Browse our current trailer
              inventory below for available assets, photographs,
              specifications and pricing information.
            </p>

            <p className="mt-5 text-lg leading-8 text-gray-600">
              Select a trailer to view its complete listing or enquire
              directly with NEWTA Commercial Sales.
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
      No trailers currently available
    </h2>

    <p className="mt-3 text-gray-600">
      Please check back soon for new trailer listings.
    </p>

    <Link
      href="/equipment"
      className="mt-6 inline-block rounded-xl bg-[#D4AF37] px-6 py-3 font-bold text-[#0B2F24]"
    >
      View All Equipment
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
                  Commercial Trailers
                </h3>

                <p className="mt-3 text-gray-600">
                  Browse available commercial trailers suitable for
                  transport, construction and other commercial
                  applications.
                </p>

              </div>

              <div className="rounded-2xl border p-6 shadow-sm">

                <h3 className="text-xl font-bold text-[#0B2F24]">
                  Side Tipper Trailers
                </h3>

                <p className="mt-3 text-gray-600">
                  View available side tipper trailer assets and their
                  individual specifications and photographs.
                </p>

              </div>

              <div className="rounded-2xl border p-6 shadow-sm">

                <h3 className="text-xl font-bold text-[#0B2F24]">
                  Private Treaty Sales
                </h3>

                <p className="mt-3 text-gray-600">
                  Contact NEWTA Commercial Sales directly about an
                  available trailer or another commercial asset.
                </p>

              </div>

            </div>

          </div>

        </section>

        {/* RELATED VEHICLES */}

        <section className="bg-[#FAF8F2]">

          <div className="mx-auto max-w-7xl px-6 py-16">

            <h2 className="text-3xl font-bold text-[#0B2F24]">
              More Commercial Vehicles
            </h2>

            <p className="mt-4 max-w-3xl text-lg text-gray-600">
              Looking for trucks, buses, trailers or other commercial
              vehicles? Browse the full NEWTA inventory.
            </p>

            <Link
              href="/equipment/trucks-for-sale-south-africa"
              className="mt-6 inline-block rounded-xl bg-[#0B2F24] px-7 py-3 font-bold text-white transition hover:bg-green-900"
            >
              View Commercial Vehicles →
            </Link>

          </div>

        </section>

        {/* CTA */}

        <section className="bg-[#0B2F24] text-white">

          <div className="mx-auto max-w-7xl px-6 py-16 text-center">

            <h2 className="text-3xl font-bold md:text-4xl">
              Looking for a Trailer?
            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-300">
              Contact NEWTA Commercial Sales if you are looking for a
              particular trailer or want more information about an
              available asset.
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