import type { Metadata } from "next";
import Link from "next/link";

import connectDB from "@/lib/mongodb";
import Equipment from "@/models/Equipment";

import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import EquipmentCard from "../../components/EquipmentCard";

export const metadata: Metadata = {
  title:
    "Mining Equipment for Sale South Africa | NEWTA Commercial Sales",

  description:
    "Browse mining equipment for sale in South Africa through NEWTA Commercial Sales. View available mining machinery and commercial equipment offered through Private Treaty Sales.",

  alternates: {
    canonical:
      "https://newtacommercialsales.com/equipment/mining-equipment-for-sale-south-africa",
  },

  openGraph: {
    title:
      "Mining Equipment for Sale South Africa | NEWTA Commercial Sales",

    description:
      "Browse mining equipment currently available through NEWTA Commercial Sales. Find mining machinery and commercial equipment available through Private Treaty Sales.",

    url:
      "https://newtacommercialsales.com/equipment/mining-equipment-for-sale-south-africa",

    type: "website",

    siteName: "NEWTA Commercial Sales",

    locale: "en_ZA",
  },

  twitter: {
    card: "summary_large_image",

    title:
      "Mining Equipment for Sale South Africa | NEWTA Commercial Sales",

    description:
      "Browse available mining equipment through NEWTA Commercial Sales.",
  },
};

export default async function MiningEquipmentForSalePage() {
  await connectDB();

  const equipment = await Equipment.find({
    category: "Mining Equipment",
    status: "Available",
  })
    .sort({ createdAt: -1 })
    .lean();

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",

    name: "Mining Equipment for Sale South Africa",

    description:
      "Mining equipment for sale through NEWTA Commercial Sales.",

    url:
      "https://newtacommercialsales.com/equipment/mining-equipment-for-sale-south-africa",

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
                Mining Equipment for Sale South Africa
              </span>
            </nav>

            <span className="inline-block rounded-full bg-[#D4AF37] px-5 py-2 text-sm font-bold uppercase tracking-wider text-[#0B2F24]">
              Private Treaty Sales
            </span>

            <h1 className="mt-6 max-w-5xl text-4xl font-extrabold leading-tight md:text-6xl">
              Mining Equipment for Sale South Africa
            </h1>

            <p className="mt-6 max-w-4xl text-lg leading-8 text-gray-200 md:text-xl">
              Browse mining equipment currently available through
              NEWTA Commercial Sales. Our listings include commercial
              machinery and equipment offered for sale across South
              Africa through Private Treaty Sales.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">

              <Link
                href="#available-equipment"
                className="rounded-xl bg-[#D4AF37] px-7 py-3 font-bold text-[#0B2F24] transition hover:bg-[#C89B2C]"
              >
                View Available Mining Equipment
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
              Mining Equipment for Sale
            </h2>

            <p className="mt-5 text-lg leading-8 text-gray-600">
              NEWTA Commercial Sales connects buyers with mining
              equipment, machinery and other commercial assets
              available through Private Treaty Sales. Browse our
              current listings to find equipment available for sale
              across South Africa.
            </p>

            <p className="mt-5 text-lg leading-8 text-gray-600">
              Each available asset can be opened to view photographs,
              specifications, pricing, location and enquiry
              information. Equipment availability changes as new
              assets are listed and existing assets are sold.
            </p>

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
                Mining Equipment Currently Available
              </h2>

              <p className="mt-5 text-lg leading-8 text-gray-600">
                Browse the latest mining equipment listings from
                NEWTA Commercial Sales. Listings are displayed
                according to their current availability.
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
                No Mining Equipment Currently Available
              </h2>

              <p className="mx-auto mt-3 max-w-2xl text-gray-600">
                There are currently no available mining equipment
                listings. Please check back soon for new equipment
                or contact NEWTA Commercial Sales if you are looking
                for a specific machine or commercial asset.
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

        {/* MINING EQUIPMENT INFORMATION */}

        <section className="border-y bg-white">

          <div className="mx-auto max-w-7xl px-6 py-16">

            <div className="max-w-4xl">

              <h2 className="text-3xl font-bold text-[#0B2F24] md:text-4xl">
                Commercial Mining Equipment
              </h2>

              <p className="mt-5 text-lg leading-8 text-gray-600">
                NEWTA Commercial Sales provides access to commercial
                equipment and machinery offered for sale to buyers
                across South Africa. Mining-related equipment may
                become available as assets are added to the NEWTA
                marketplace.
              </p>

              <p className="mt-5 text-lg leading-8 text-gray-600">
                Equipment listings can change regularly. Buyers
                looking for a specific type of mining equipment are
                encouraged to contact NEWTA Commercial Sales if the
                required equipment is not currently listed.
              </p>

            </div>

            <div className="mt-10 grid gap-6 md:grid-cols-3">

              <div className="rounded-2xl border bg-[#FAF8F2] p-7 shadow-sm">

                <div className="text-3xl font-extrabold text-[#D4AF37]">
                  01
                </div>

                <h3 className="mt-4 text-xl font-bold text-[#0B2F24]">
                  Browse Available Equipment
                </h3>

                <p className="mt-3 leading-7 text-gray-600">
                  View current mining equipment listings and open
                  individual assets for detailed information.
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
                  Review available photographs, specifications,
                  pricing, location and other information supplied
                  with the asset.
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
                  Contact NEWTA Commercial Sales for further
                  information about an available mining asset.
                </p>

              </div>

            </div>

          </div>

        </section>

        {/* RELATED EQUIPMENT */}

        <section className="bg-[#FAF8F2]">

          <div className="mx-auto max-w-7xl px-6 py-16">

            <div className="max-w-4xl">

              <h2 className="text-3xl font-bold text-[#0B2F24] md:text-4xl">
                Other Commercial Equipment
              </h2>

              <p className="mt-5 text-lg leading-8 text-gray-600">
                NEWTA Commercial Sales also offers plant and
                machinery, drilling rigs, commercial vehicles,
                trailers and other commercial assets for sale in
                South Africa.
              </p>

            </div>

            <div className="mt-10 grid gap-6 md:grid-cols-3">

              <Link
                href="/equipment/plant-machinery-for-sale-south-africa"
                className="group rounded-2xl border bg-white p-7 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-lg"
              >

                <h3 className="text-xl font-bold text-[#0B2F24]">
                  Plant & Machinery
                </h3>

                <p className="mt-3 leading-7 text-gray-600">
                  Browse plant and machinery currently available
                  through NEWTA Commercial Sales.
                </p>

                <span className="mt-5 inline-block font-bold text-[#0B2F24]">
                  View Plant & Machinery →
                </span>

              </Link>

              <Link
                href="/equipment/drilling-rigs-for-sale-south-africa"
                className="group rounded-2xl border bg-white p-7 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-lg"
              >

                <h3 className="text-xl font-bold text-[#0B2F24]">
                  Drilling Rigs
                </h3>

                <p className="mt-3 leading-7 text-gray-600">
                  Browse drilling rigs and related commercial
                  equipment available through NEWTA.
                </p>

                <span className="mt-5 inline-block font-bold text-[#0B2F24]">
                  View Drilling Rigs →
                </span>

              </Link>

              <Link
                href="/equipment/construction-equipment-for-sale-south-africa"
                className="group rounded-2xl border bg-white p-7 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-lg"
              >

                <h3 className="text-xl font-bold text-[#0B2F24]">
                  Construction Equipment
                </h3>

                <p className="mt-3 leading-7 text-gray-600">
                  Browse construction equipment and machinery
                  currently available through NEWTA.
                </p>

                <span className="mt-5 inline-block font-bold text-[#0B2F24]">
                  View Construction Equipment →
                </span>

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
              Looking for Specific Mining Equipment?
            </h2>

            <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-gray-300">
              Contact NEWTA Commercial Sales if you are looking for
              a particular mining machine, equipment item or other
              commercial asset that is not currently listed.
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