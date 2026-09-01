import type { Metadata } from "next";
import Link from "next/link";

import connectDB from "@/lib/mongodb";
import Equipment from "@/models/Equipment";

import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import EquipmentCard from "../../components/EquipmentCard";

export const metadata: Metadata = {
  title:
    "Other Assets for Sale South Africa | NEWTA Commercial Sales",

  description:
    "Browse other commercial, industrial and business assets for sale in South Africa through NEWTA Commercial Sales. Find industrial equipment, workshop equipment, tools, spares, attachments, generators, pumps, machinery and other assets.",

  alternates: {
    canonical:
      "https://newtacommercialsales.com/equipment/other-assets-for-sale-south-africa",
  },

  openGraph: {
    title:
      "Other Assets for Sale South Africa | NEWTA Commercial Sales",

    description:
      "Browse commercial, industrial and business assets currently available through NEWTA Commercial Sales across South Africa.",

    url:
      "https://newtacommercialsales.com/equipment/other-assets-for-sale-south-africa",

    type: "website",

    siteName: "NEWTA Commercial Sales",

    locale: "en_ZA",
  },

  twitter: {
    card: "summary_large_image",

    title:
      "Other Assets for Sale South Africa | NEWTA Commercial Sales",

    description:
      "Browse other commercial, industrial and business assets available through NEWTA Commercial Sales.",
  },
};

export default async function OtherAssetsForSaleSouthAfrica() {
  await connectDB();

  const equipment = await Equipment.find({
    category: "Other Assets",
    status: "Available",
  })
    .sort({ createdAt: -1 })
    .lean();

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",

    name: "Other Assets for Sale South Africa",

    description:
      "Other commercial, industrial and business assets for sale through NEWTA Commercial Sales.",

    url:
      "https://newtacommercialsales.com/equipment/other-assets-for-sale-south-africa",

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
                Other Assets for Sale South Africa
              </span>

            </nav>

            <span className="inline-block rounded-full bg-[#D4AF37] px-5 py-2 text-sm font-bold uppercase tracking-wider text-[#0B2F24]">
              Private Treaty Sales
            </span>

            <h1 className="mt-6 max-w-5xl text-4xl font-extrabold leading-tight md:text-6xl">
              Other Assets for Sale South Africa
            </h1>

            <p className="mt-6 max-w-4xl text-lg leading-8 text-gray-200 md:text-xl">
              Browse a broad range of commercial, industrial and
              business assets available through NEWTA Commercial Sales.
              This section is for assets that do not fall neatly into
              our standard vehicle, plant, machinery, mining or drilling
              categories.
            </p>

            <p className="mt-5 max-w-4xl text-lg leading-8 text-gray-200 md:text-xl">
              Listings may include industrial equipment, workshop
              equipment, tools, spare parts, attachments, generators,
              pumps, manufacturing equipment and other commercial
              assets available for sale across South Africa.
            </p>

          </div>

        </section>

        {/* INTRODUCTION */}

        <section className="mx-auto max-w-7xl px-6 py-16">

          <div className="max-w-4xl">

            <h2 className="text-3xl font-bold text-[#0B2F24] md:text-4xl">
              Other Commercial & Industrial Assets for Sale
            </h2>

            <p className="mt-5 text-lg leading-8 text-gray-600">
              Not every commercial asset fits into a single equipment
              category. NEWTA Commercial Sales provides this section
              for a wide range of assets that may be used in
              construction, mining, agriculture, transport, industry,
              manufacturing, workshops and general business operations.
            </p>

            <p className="mt-5 text-lg leading-8 text-gray-600">
              Browse the current listings below to view photographs,
              specifications, pricing and enquiry information for each
              available asset.
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
                No other assets currently available
              </h2>

              <p className="mt-3 text-gray-600">
                Please check back soon for new commercial,
                industrial and business asset listings.
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

        {/* ASSET TYPES */}

        <section className="border-t bg-white">

          <div className="mx-auto max-w-7xl px-6 py-16">

            <div className="max-w-4xl">

              <h2 className="text-3xl font-bold text-[#0B2F24] md:text-4xl">
                What Can Be Listed Under Other Assets?
              </h2>

              <p className="mt-5 text-lg leading-8 text-gray-600">
                The Other Assets category gives NEWTA Commercial Sales
                flexibility to market a broad range of commercial,
                industrial and business assets that may not have their
                own dedicated category.
              </p>

            </div>

            <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">

              <div className="rounded-2xl border bg-[#FAF8F2] p-7 shadow-sm">

                <h3 className="text-xl font-bold text-[#0B2F24]">
                  Industrial Equipment
                </h3>

                <p className="mt-3 leading-7 text-gray-600">
                  Industrial machinery, production equipment,
                  manufacturing equipment and other equipment used
                  in commercial operations.
                </p>

              </div>

              <div className="rounded-2xl border bg-[#FAF8F2] p-7 shadow-sm">

                <h3 className="text-xl font-bold text-[#0B2F24]">
                  Workshop Equipment
                </h3>

                <p className="mt-3 leading-7 text-gray-600">
                  Workshop machinery, garage equipment, fabrication
                  equipment and other tools used in industrial and
                  commercial workshops.
                </p>

              </div>

              <div className="rounded-2xl border bg-[#FAF8F2] p-7 shadow-sm">

                <h3 className="text-xl font-bold text-[#0B2F24]">
                  Tools & Equipment
                </h3>

                <p className="mt-3 leading-7 text-gray-600">
                  Commercial tools, specialist equipment and other
                  useful assets available for businesses and operators.
                </p>

              </div>

              <div className="rounded-2xl border bg-[#FAF8F2] p-7 shadow-sm">

                <h3 className="text-xl font-bold text-[#0B2F24]">
                  Spares & Components
                </h3>

                <p className="mt-3 leading-7 text-gray-600">
                  Spare parts, components and replacement equipment
                  that can be useful for commercial vehicles,
                  machinery and industrial operations.
                </p>

              </div>

              <div className="rounded-2xl border bg-[#FAF8F2] p-7 shadow-sm">

                <h3 className="text-xl font-bold text-[#0B2F24]">
                  Attachments & Accessories
                </h3>

                <p className="mt-3 leading-7 text-gray-600">
                  Machinery attachments, accessories and related
                  commercial equipment that do not require their
                  own dedicated category.
                </p>

              </div>

              <div className="rounded-2xl border bg-[#FAF8F2] p-7 shadow-sm">

                <h3 className="text-xl font-bold text-[#0B2F24]">
                  Business Assets
                </h3>

                <p className="mt-3 leading-7 text-gray-600">
                  Commercial and business assets that may form part
                  of a company, workshop, factory, operation or
                  asset disposal.
                </p>

              </div>

            </div>

          </div>

        </section>

        {/* WHY OTHER ASSETS */}

        <section className="bg-[#FAF8F2]">

          <div className="mx-auto max-w-7xl px-6 py-16">

            <div className="grid gap-10 md:grid-cols-2">

              <div>

                <h2 className="text-3xl font-bold text-[#0B2F24] md:text-4xl">
                  A Broad Commercial Sales Category
                </h2>

                <p className="mt-5 text-lg leading-8 text-gray-600">
                  NEWTA Commercial Sales is not limited to one type
                  of machinery or vehicle. We market a wide range of
                  commercial and industrial assets through Private
                  Treaty Sales.
                </p>

                <p className="mt-5 text-lg leading-8 text-gray-600">
                  The Other Assets section allows suitable assets to
                  be marketed even when they do not have a dedicated
                  category on the website.
                </p>

              </div>

              <div className="rounded-2xl bg-white p-8 shadow-sm border">

                <h3 className="text-2xl font-bold text-[#0B2F24]">
                  Looking for Something Specific?
                </h3>

                <p className="mt-4 leading-7 text-gray-600">
                  If you cannot find the type of asset you are looking
                  for, contact NEWTA Commercial Sales. We may have an
                  asset available that has not yet been listed or can
                  assist with your enquiry.
                </p>

                <Link
                  href="/contact"
                  className="mt-6 inline-block rounded-xl bg-[#D4AF37] px-7 py-3 font-bold text-[#0B2F24] transition hover:bg-[#C89B2C]"
                >
                  Contact NEWTA
                </Link>

              </div>

            </div>

          </div>

        </section>

        {/* RELATED EQUIPMENT */}

        <section className="border-t bg-white">

          <div className="mx-auto max-w-7xl px-6 py-16">

            <h2 className="text-3xl font-bold text-[#0B2F24] md:text-4xl">
              Browse More Equipment & Commercial Assets
            </h2>

            <p className="mt-4 max-w-3xl text-lg leading-8 text-gray-600">
              Looking for a specific type of commercial vehicle,
              machinery or industrial equipment? Browse the full
              NEWTA Commercial Sales inventory.
            </p>

            <Link
              href="/equipment"
              className="mt-7 inline-block rounded-xl bg-[#0B2F24] px-7 py-3 font-bold text-white transition hover:bg-green-900"
            >
              View All Equipment →
            </Link>

          </div>

        </section>

        {/* SELL ASSET CTA */}

        <section className="bg-[#0B2F24] text-white">

          <div className="mx-auto max-w-7xl px-6 py-16 text-center">

            <span className="inline-block rounded-full bg-[#D4AF37] px-5 py-2 text-sm font-bold uppercase tracking-wider text-[#0B2F24]">
              Private Treaty Sales
            </span>

            <h2 className="mt-6 text-3xl font-bold md:text-4xl">
              Have a Commercial or Industrial Asset to Sell?
            </h2>

            <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-gray-300">
              NEWTA Commercial Sales can assist with the marketing
              and sale of commercial vehicles, machinery, industrial
              equipment and other business assets through Private
              Treaty Sales.
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