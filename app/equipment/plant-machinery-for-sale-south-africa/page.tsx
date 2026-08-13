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
    "Plant & Machinery for Sale South Africa | NEWTA Commercial Sales",

  description:
    "Browse plant and machinery for sale in South Africa through NEWTA Commercial Sales. View available crushing and screening equipment, cranes, construction equipment, agricultural equipment and compressors.",

  alternates: {
    canonical:
      "https://newtacommercialsales.com/equipment/plant-machinery-for-sale-south-africa",
  },

  openGraph: {
    title:
      "Plant & Machinery for Sale South Africa | NEWTA Commercial Sales",

    description:
      "Browse plant and machinery currently available through NEWTA Commercial Sales across South Africa.",

    url:
      "https://newtacommercialsales.com/equipment/plant-machinery-for-sale-south-africa",

    type: "website",

    siteName: "NEWTA Commercial Sales",

    locale: "en_ZA",
  },

  twitter: {
    card: "summary_large_image",

    title:
      "Plant & Machinery for Sale South Africa | NEWTA Commercial Sales",

    description:
      "Browse available plant and machinery through NEWTA Commercial Sales.",
  },
};

export default async function PlantMachineryForSalePage() {
  await connectDB();

  const plantMachinery = equipmentCategories.find(
    (category) => category.slug === "plant-machinery"
  );

  const equipment = await Equipment.find({
    category: plantMachinery?.name,
    status: "Available",
  })
    .sort({ createdAt: -1 })
    .lean();

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",

    name: "Plant & Machinery for Sale South Africa",

    description:
      "Plant and machinery for sale through NEWTA Commercial Sales.",

    url:
      "https://newtacommercialsales.com/equipment/plant-machinery-for-sale-south-africa",

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

              <span className="mx-2">
                /
              </span>

              <Link
                href="/equipment"
                className="hover:text-[#D4AF37]"
              >
                Equipment
              </Link>

              <span className="mx-2">
                /
              </span>

              <span className="text-[#D4AF37]">
                Plant & Machinery for Sale South Africa
              </span>
            </nav>

            <span className="inline-block rounded-full bg-[#D4AF37] px-5 py-2 text-sm font-bold uppercase tracking-wider text-[#0B2F24]">
              Private Treaty Sales
            </span>

            <h1 className="mt-6 max-w-5xl text-4xl font-extrabold leading-tight md:text-6xl">
              Plant & Machinery for Sale South Africa
            </h1>

            <p className="mt-6 max-w-4xl text-lg leading-8 text-gray-200 md:text-xl">
              Browse plant and machinery currently available through
              NEWTA Commercial Sales. Our inventory includes crushing
              and screening equipment, cranes, construction equipment,
              agricultural equipment and compressors available through
              Private Treaty Sales across South Africa.
            </p>

          </div>

        </section>

        {/* CONTENT */}

        <section className="mx-auto max-w-7xl px-6 py-16">

          <div className="max-w-4xl">

            <h2 className="text-3xl font-bold text-[#0B2F24] md:text-4xl">
              Plant & Machinery for Sale
            </h2>

            <p className="mt-5 text-lg leading-8 text-gray-600">
              NEWTA Commercial Sales connects buyers with plant,
              machinery and commercial assets available from sellers
              across South Africa. Browse our current plant and
              machinery listings below for specifications, photographs,
              pricing and enquiry information.
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
                No plant & machinery currently available
              </h2>

              <p className="mt-3 text-gray-600">
                Please check back soon for new plant and machinery
                listings.
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

        {/* PLANT & MACHINERY CATEGORIES */}

        <section className="border-t bg-white">

          <div className="mx-auto max-w-7xl px-6 py-16">

            <h2 className="text-3xl font-bold text-[#0B2F24] md:text-4xl">
              Plant & Machinery Categories
            </h2>

            <p className="mt-5 max-w-4xl text-lg leading-8 text-gray-600">
              Explore the different types of plant and machinery
              available through NEWTA Commercial Sales.
            </p>

            <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">

              <Link
                href="/equipment/mobile-crushers-screening-equipment-for-sale-south-africa"
                className="rounded-2xl border bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >

                <h3 className="text-xl font-bold text-[#0B2F24]">
                  Crushing & Screening
                </h3>

                <p className="mt-3 text-gray-600">
                  Browse mobile crushers and screening equipment
                  available through NEWTA Commercial Sales.
                </p>

                <span className="mt-5 inline-block font-bold text-[#0B2F24]">
                  View Crushing & Screening →
                </span>

              </Link>

              <Link
                href="/equipment/cranes-for-sale-south-africa"
                className="rounded-2xl border bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >

                <h3 className="text-xl font-bold text-[#0B2F24]">
                  Cranes
                </h3>

                <p className="mt-3 text-gray-600">
                  Browse cranes and lifting equipment available
                  through Private Treaty Sales.
                </p>

                <span className="mt-5 inline-block font-bold text-[#0B2F24]">
                  View Cranes →
                </span>

              </Link>

              <Link
                href="/equipment/construction-equipment-for-sale-south-africa"
                className="rounded-2xl border bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >

                <h3 className="text-xl font-bold text-[#0B2F24]">
                  Construction Equipment
                </h3>

                <p className="mt-3 text-gray-600">
                  Browse construction equipment and machinery
                  available across South Africa.
                </p>

                <span className="mt-5 inline-block font-bold text-[#0B2F24]">
                  View Construction Equipment →
                </span>

              </Link>

              <Link
                href="/equipment/agricultural-equipment-for-sale-south-africa"
                className="rounded-2xl border bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >

                <h3 className="text-xl font-bold text-[#0B2F24]">
                  Agricultural Equipment
                </h3>

                <p className="mt-3 text-gray-600">
                  Browse agricultural machinery and equipment
                  available through NEWTA Commercial Sales.
                </p>

                <span className="mt-5 inline-block font-bold text-[#0B2F24]">
                  View Agricultural Equipment →
                </span>

              </Link>

              <Link
                href="/equipment/compressors-for-sale-south-africa"
                className="rounded-2xl border bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >

                <h3 className="text-xl font-bold text-[#0B2F24]">
                  Compressors
                </h3>

                <p className="mt-3 text-gray-600">
                  Browse compressors and related equipment available
                  through NEWTA Commercial Sales.
                </p>

                <span className="mt-5 inline-block font-bold text-[#0B2F24]">
                  View Compressors →
                </span>

              </Link>

            </div>

          </div>

        </section>

        {/* BUYER INFORMATION */}

        <section className="bg-[#FAF8F2]">

          <div className="mx-auto max-w-7xl px-6 py-16">

            <div className="grid gap-8 md:grid-cols-3">

              <div className="rounded-2xl border bg-white p-6 shadow-sm">

                <h3 className="text-xl font-bold text-[#0B2F24]">
                  View Specifications
                </h3>

                <p className="mt-3 text-gray-600">
                  Review available specifications, condition,
                  photographs, pricing and other information provided
                  for each plant and machinery listing.
                </p>

              </div>

              <div className="rounded-2xl border bg-white p-6 shadow-sm">

                <h3 className="text-xl font-bold text-[#0B2F24]">
                  Private Treaty Sales
                </h3>

                <p className="mt-3 text-gray-600">
                  NEWTA Commercial Sales specialises in straightforward
                  Private Treaty Sales of commercial vehicles, machinery
                  and industrial assets.
                </p>

              </div>

              <div className="rounded-2xl border bg-white p-6 shadow-sm">

                <h3 className="text-xl font-bold text-[#0B2F24]">
                  Enquire About an Asset
                </h3>

                <p className="mt-3 text-gray-600">
                  Found the right machine? Open the listing and contact
                  NEWTA Commercial Sales for further information.
                </p>

              </div>

            </div>

          </div>

        </section>

        {/* CTA */}

        <section className="bg-[#0B2F24] text-white">

          <div className="mx-auto max-w-7xl px-6 py-16 text-center">

            <h2 className="text-3xl font-bold md:text-4xl">
              Looking for Specific Plant or Machinery?
            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-300">
              Contact NEWTA Commercial Sales if you are looking for
              a particular machine or want more information about an
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