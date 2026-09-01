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
    "Browse plant and machinery for sale in South Africa through NEWTA Commercial Sales. Find construction equipment, cranes, agricultural machinery, compressors, crushing and screening equipment available through Private Treaty Sales.",

  alternates: {
    canonical:
      "https://newtacommercialsales.com/equipment/plant-machinery-for-sale-south-africa",
  },

  openGraph: {
    title:
      "Plant & Machinery for Sale South Africa | NEWTA Commercial Sales",

    description:
      "Browse plant and machinery currently available through NEWTA Commercial Sales, including construction equipment, cranes, agricultural machinery, compressors and crushing and screening equipment.",

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

  const categories =
    plantMachinery?.subcategories ?? [];

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
              NEWTA Commercial Sales. Our listings include construction
              equipment, cranes, agricultural machinery, compressors,
              crushing and screening equipment and other commercial
              machinery available across South Africa.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">

              <Link
                href="#available-equipment"
                className="rounded-xl bg-[#D4AF37] px-7 py-3 font-bold text-[#0B2F24] transition hover:bg-[#C89B2C]"
              >
                View Available Machinery
              </Link>

              <Link
                href="/contact"
                className="rounded-xl border border-white/30 bg-white/10 px-7 py-3 font-bold text-white transition hover:bg-white/20"
              >
                Enquire About Equipment
              </Link>

            </div>

          </div>

        </section>

        {/* INTRODUCTION */}

        <section className="mx-auto max-w-7xl px-6 py-16">

          <div className="max-w-4xl">

            <h2 className="text-3xl font-bold text-[#0B2F24] md:text-4xl">
              Plant & Machinery for Sale
            </h2>

            <p className="mt-5 text-lg leading-8 text-gray-600">
              NEWTA Commercial Sales connects buyers with plant,
              machinery and commercial assets available through
              Private Treaty Sales. Browse our current machinery
              listings to find equipment available for sale across
              South Africa.
            </p>

            <p className="mt-5 text-lg leading-8 text-gray-600">
              Each available asset can be opened to view photographs,
              specifications, pricing, location and enquiry
              information. Select a category below or browse the
              available plant and machinery listings.
            </p>

          </div>

        </section>

        {/* CATEGORIES */}

        <section className="border-y bg-white">

          <div className="mx-auto max-w-7xl px-6 py-16">

            <div className="max-w-4xl">

              <h2 className="text-3xl font-bold text-[#0B2F24] md:text-4xl">
                Plant & Machinery Categories
              </h2>

              <p className="mt-5 text-lg leading-8 text-gray-600">
                Explore the main plant and machinery categories
                available through NEWTA Commercial Sales.
              </p>

            </div>

            <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">

              {categories.map((subcategory) => (

                <Link
                  key={subcategory.slug}
                  href={`/equipment/${subcategory.seoSlug ?? subcategory.slug}`}
                  className="group rounded-2xl border bg-[#FAF8F2] p-7 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-lg"
                >

                  <div className="flex items-start justify-between gap-4">

                    <h3 className="text-xl font-bold text-[#0B2F24]">
                      {subcategory.name}
                    </h3>

                    <span className="text-xl font-bold text-[#D4AF37] transition group-hover:translate-x-1">
                      →
                    </span>

                  </div>

                  <p className="mt-4 leading-7 text-gray-600">
                    Browse {subcategory.name.toLowerCase()} currently
                    available through NEWTA Commercial Sales.
                  </p>

                  <span className="mt-5 inline-block font-bold text-[#0B2F24]">
                    View {subcategory.name}
                  </span>

                </Link>

              ))}

            </div>

          </div>

        </section>

        {/* AVAILABLE EQUIPMENT */}

        <section
          id="available-equipment"
          className="mx-auto max-w-7xl px-6 py-16"
        >

          <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">

            <div className="max-w-4xl">

              <h2 className="text-3xl font-bold text-[#0B2F24] md:text-4xl">
                Plant & Machinery Currently Available
              </h2>

              <p className="mt-5 text-lg leading-8 text-gray-600">
                Browse the latest available plant and machinery
                listings from NEWTA Commercial Sales. Listings are
                displayed according to their current availability.
              </p>

            </div>

            <div className="shrink-0 rounded-xl bg-white px-5 py-3 text-sm font-bold text-[#0B2F24] shadow-sm ring-1 ring-gray-200">
              {equipment.length}{" "}
              {equipment.length === 1
                ? "Available Asset"
                : "Available Assets"}
            </div>

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
                No plant & machinery currently available
              </h2>

              <p className="mx-auto mt-3 max-w-2xl text-gray-600">
                There are currently no available plant and machinery
                listings. Please check back soon for new equipment
                or contact NEWTA Commercial Sales if you are looking
                for a specific machine.
              </p>

              <Link
                href="/contact"
                className="mt-6 inline-block rounded-xl bg-[#D4AF37] px-6 py-3 font-bold text-[#0B2F24] transition hover:bg-[#C89B2C]"
              >
                Contact NEWTA
              </Link>

            </div>

          )}

        </section>

        {/* WHY NEWTA */}

        <section className="border-t bg-white">

          <div className="mx-auto max-w-7xl px-6 py-16">

            <div className="max-w-4xl">

              <h2 className="text-3xl font-bold text-[#0B2F24] md:text-4xl">
                Buying Plant & Machinery Through NEWTA
              </h2>

              <p className="mt-5 text-lg leading-8 text-gray-600">
                NEWTA Commercial Sales provides buyers with direct
                access to commercial vehicles, plant, machinery and
                industrial assets offered through Private Treaty
                Sales.
              </p>

            </div>

            <div className="mt-10 grid gap-6 md:grid-cols-3">

              <div className="rounded-2xl border bg-[#FAF8F2] p-7 shadow-sm">

                <div className="text-3xl font-extrabold text-[#D4AF37]">
                  01
                </div>

                <h3 className="mt-4 text-xl font-bold text-[#0B2F24]">
                  Browse Equipment
                </h3>

                <p className="mt-3 leading-7 text-gray-600">
                  Browse available plant and machinery by category
                  or view the latest available assets.
                </p>

              </div>

              <div className="rounded-2xl border bg-[#FAF8F2] p-7 shadow-sm">

                <div className="text-3xl font-extrabold text-[#D4AF37]">
                  02
                </div>

                <h3 className="mt-4 text-xl font-bold text-[#0B2F24]">
                  Review the Listing
                </h3>

                <p className="mt-3 leading-7 text-gray-600">
                  View available photographs, specifications,
                  pricing, location and other information provided
                  for the asset.
                </p>

              </div>

              <div className="rounded-2xl border bg-[#FAF8F2] p-7 shadow-sm">

                <div className="text-3xl font-extrabold text-[#D4AF37]">
                  03
                </div>

                <h3 className="mt-4 text-xl font-bold text-[#0B2F24]">
                  Make an Enquiry
                </h3>

                <p className="mt-3 leading-7 text-gray-600">
                  Contact NEWTA Commercial Sales directly for
                  further information about an available asset.
                </p>

              </div>

            </div>

          </div>

        </section>

        {/* EQUIPMENT TYPES */}

        <section className="bg-[#FAF8F2]">

          <div className="mx-auto max-w-7xl px-6 py-16">

            <div className="max-w-4xl">

              <h2 className="text-3xl font-bold text-[#0B2F24] md:text-4xl">
                Commercial Plant & Machinery
              </h2>

              <p className="mt-5 text-lg leading-8 text-gray-600">
                Our plant and machinery section is designed for
                buyers looking for equipment used across construction,
                mining, agriculture, material handling, industrial
                operations and other commercial applications.
              </p>

              <p className="mt-5 text-lg leading-8 text-gray-600">
                Available equipment changes as new assets are listed
                and existing assets are sold. Check the individual
                category pages for the latest available listings.
              </p>

            </div>

            <div className="mt-10 grid gap-6 md:grid-cols-2">

              <div className="rounded-2xl bg-white p-7 shadow-sm ring-1 ring-gray-200">

                <h3 className="text-xl font-bold text-[#0B2F24]">
                  Construction & Infrastructure
                </h3>

                <p className="mt-3 leading-7 text-gray-600">
                  Construction equipment and machinery available for
                  commercial and infrastructure-related applications.
                </p>

              </div>

              <div className="rounded-2xl bg-white p-7 shadow-sm ring-1 ring-gray-200">

                <h3 className="text-xl font-bold text-[#0B2F24]">
                  Industrial & Material Processing
                </h3>

                <p className="mt-3 leading-7 text-gray-600">
                  Crushing, screening, compressors and other
                  machinery used in industrial and material processing
                  applications.
                </p>

              </div>

              <div className="rounded-2xl bg-white p-7 shadow-sm ring-1 ring-gray-200">

                <h3 className="text-xl font-bold text-[#0B2F24]">
                  Agriculture
                </h3>

                <p className="mt-3 leading-7 text-gray-600">
                  Agricultural machinery and equipment available
                  through NEWTA Commercial Sales.
                </p>

              </div>

              <div className="rounded-2xl bg-white p-7 shadow-sm ring-1 ring-gray-200">

                <h3 className="text-xl font-bold text-[#0B2F24]">
                  Lifting Equipment
                </h3>

                <p className="mt-3 leading-7 text-gray-600">
                  Cranes and related lifting equipment available
                  through Private Treaty Sales.
                </p>

              </div>

            </div>

          </div>

        </section>

        {/* RELATED EQUIPMENT */}

        <section className="border-t bg-white">

          <div className="mx-auto max-w-7xl px-6 py-16">

            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">

              <div className="max-w-3xl">

                <h2 className="text-3xl font-bold text-[#0B2F24]">
                  Looking for Other Commercial Assets?
                </h2>

                <p className="mt-4 text-lg leading-8 text-gray-600">
                  NEWTA Commercial Sales also offers commercial
                  vehicles, drilling rigs, mining equipment and other
                  commercial and industrial assets.
                </p>

              </div>

              <Link
                href="/equipment"
                className="shrink-0 rounded-xl bg-[#0B2F24] px-7 py-3 font-bold text-white transition hover:bg-green-900"
              >
                View All Equipment →
              </Link>

            </div>

          </div>

        </section>

        {/* CTA */}

        <section className="bg-[#0B2F24] text-white">

          <div className="mx-auto max-w-7xl px-6 py-16 text-center">

            <span className="inline-block rounded-full bg-[#D4AF37] px-5 py-2 text-sm font-bold uppercase tracking-wider text-[#0B2F24]">
              NEWTA Commercial Sales
            </span>

            <h2 className="mt-6 text-3xl font-bold md:text-4xl">
              Looking for Specific Plant or Machinery?
            </h2>

            <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-gray-300">
              Contact NEWTA Commercial Sales if you are looking for
              a particular machine, plant item or commercial asset
              that is not currently listed.
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