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
    "Mobile Crushers & Screening Equipment for Sale South Africa | NEWTA Commercial Sales",

  description:
    "Browse mobile crushers and screening equipment for sale in South Africa through NEWTA Commercial Sales. View available crushing and screening plant, specifications, images, pricing and enquiry information.",

  alternates: {
    canonical:
      "https://newtacommercialsales.com/equipment/mobile-crushers-screening-equipment-for-sale-south-africa",
  },

  openGraph: {
    title:
      "Mobile Crushers & Screening Equipment for Sale South Africa | NEWTA Commercial Sales",

    description:
      "Browse mobile crushers and screening equipment currently available through NEWTA Commercial Sales across South Africa.",

    url:
      "https://newtacommercialsales.com/equipment/mobile-crushers-screening-equipment-for-sale-south-africa",

    type: "website",

    siteName: "NEWTA Commercial Sales",

    locale: "en_ZA",
  },

  twitter: {
    card: "summary_large_image",

    title:
      "Mobile Crushers & Screening Equipment for Sale South Africa | NEWTA Commercial Sales",

    description:
      "Browse mobile crushers and screening equipment available through NEWTA Commercial Sales.",
  },
};

export default async function MobileCrushersScreeningPage() {
  await connectDB();

  const plantMachinery = equipmentCategories.find(
    (category) => category.slug === "plant-machinery"
  );

  const crushingScreening = plantMachinery?.subcategories.find(
    (subcategory) => subcategory.slug === "crushing-screening"
  );

  const equipment = await Equipment.find({
    category: plantMachinery?.name,
    subcategory: crushingScreening?.name,
    status: "Available",
  })
    .sort({ createdAt: -1 })
    .lean();

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",

    name: "Mobile Crushers & Screening Equipment for Sale South Africa",

    description:
      "Mobile crushers and screening equipment for sale through NEWTA Commercial Sales.",

    url:
      "https://newtacommercialsales.com/equipment/mobile-crushers-screening-equipment-for-sale-south-africa",

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

              <Link
                href="/equipment/plant-machinery-for-sale-south-africa"
                className="hover:text-[#D4AF37]"
              >
                Plant & Machinery
              </Link>

              <span className="mx-2">
                /
              </span>

              <span className="text-[#D4AF37]">
                Mobile Crushers & Screening Equipment
              </span>

            </nav>

            <span className="inline-block rounded-full bg-[#D4AF37] px-5 py-2 text-sm font-bold uppercase tracking-wider text-[#0B2F24]">
              Private Treaty Sales
            </span>

            <h1 className="mt-6 max-w-5xl text-4xl font-extrabold leading-tight md:text-6xl">
              Mobile Crushers & Screening Equipment for Sale South Africa
            </h1>

            <p className="mt-6 max-w-4xl text-lg leading-8 text-gray-200 md:text-xl">
              Browse mobile crushers and screening equipment currently
              available through NEWTA Commercial Sales. View available
              crushing and screening plant with photographs,
              specifications, pricing and enquiry information for
              equipment available across South Africa.
            </p>

          </div>

        </section>

        {/* INTRODUCTION */}

        <section className="mx-auto max-w-7xl px-6 py-16">

          <div className="max-w-4xl">

            <h2 className="text-3xl font-bold text-[#0B2F24] md:text-4xl">
              Mobile Crushers & Screening Equipment for Sale
            </h2>

            <p className="mt-5 text-lg leading-8 text-gray-600">
              NEWTA Commercial Sales offers crushing and screening
              equipment through Private Treaty Sales. Browse current
              mobile crushers, screening plant and related equipment
              available for sale across South Africa.
            </p>

            <p className="mt-5 text-lg leading-8 text-gray-600">
              Crushing and screening equipment is used in quarrying,
              aggregate production, mining, construction, recycling,
              road building and material processing operations. The
              right equipment depends on the material being processed,
              required output and operating application.
            </p>

            <p className="mt-5 text-lg leading-8 text-gray-600">
              Browse the current NEWTA listings below to view
              photographs, specifications, pricing, location and
              enquiry information for each available asset.
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
                No mobile crushers or screening equipment currently available
              </h2>

              <p className="mt-3 text-gray-600">
                Please check back soon for new crushing and screening
                equipment listings.
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

        {/* EQUIPMENT APPLICATIONS */}

        <section className="border-t bg-white">

          <div className="mx-auto max-w-7xl px-6 py-16">

            <h2 className="text-3xl font-bold text-[#0B2F24] md:text-4xl">
              Crushing & Screening Equipment Applications
            </h2>

            <p className="mt-4 max-w-4xl text-lg leading-8 text-gray-600">
              Crushing and screening plant plays an important role in
              processing materials for construction, quarrying,
              mining and other industrial applications.
            </p>

            <div className="mt-10 grid gap-6 md:grid-cols-3">

              <div className="rounded-2xl border bg-[#FAF8F2] p-6 shadow-sm">

                <h3 className="text-xl font-bold text-[#0B2F24]">
                  Mobile Crushing
                </h3>

                <p className="mt-3 leading-7 text-gray-600">
                  Mobile crushing equipment can be used to reduce
                  rock, aggregate and other materials to the required
                  size for further processing or use.
                </p>

              </div>

              <div className="rounded-2xl border bg-[#FAF8F2] p-6 shadow-sm">

                <h3 className="text-xl font-bold text-[#0B2F24]">
                  Screening Plant
                </h3>

                <p className="mt-3 leading-7 text-gray-600">
                  Screening equipment separates processed material
                  into different sizes and can form an important part
                  of aggregate and material-processing operations.
                </p>

              </div>

              <div className="rounded-2xl border bg-[#FAF8F2] p-6 shadow-sm">

                <h3 className="text-xl font-bold text-[#0B2F24]">
                  Quarry & Construction
                </h3>

                <p className="mt-3 leading-7 text-gray-600">
                  Crushing and screening equipment can be used in
                  quarrying, construction, road building and aggregate
                  production applications.
                </p>

              </div>

            </div>

          </div>

        </section>

        {/* BUYER INFORMATION */}

        <section className="bg-[#FAF8F2]">

          <div className="mx-auto max-w-7xl px-6 py-16">

            <h2 className="text-3xl font-bold text-[#0B2F24] md:text-4xl">
              Buying Crushing & Screening Equipment
            </h2>

            <p className="mt-5 max-w-4xl text-lg leading-8 text-gray-600">
              Buyers can review the available information for each
              asset before making an enquiry. Listing information may
              include photographs, specifications, operating hours,
              location, pricing and other details provided for the
              individual machine.
            </p>

            <p className="mt-5 max-w-4xl text-lg leading-8 text-gray-600">
              Equipment availability changes as assets are sold and
              new machinery is added to the NEWTA Commercial Sales
              inventory.
            </p>

          </div>

        </section>

        {/* RELATED EQUIPMENT */}

        <section className="border-t bg-white">

          <div className="mx-auto max-w-7xl px-6 py-16">

            <h2 className="text-3xl font-bold text-[#0B2F24]">
              More Plant & Machinery
            </h2>

            <p className="mt-4 max-w-3xl text-lg leading-8 text-gray-600">
              Looking for other construction, agricultural or
              industrial machinery? Browse the wider NEWTA
              Commercial Sales plant and machinery inventory.
            </p>

            <Link
              href="/equipment/plant-machinery-for-sale-south-africa"
              className="mt-6 inline-block rounded-xl bg-[#0B2F24] px-7 py-3 font-bold text-white transition hover:bg-green-900"
            >
              View Plant & Machinery →
            </Link>

          </div>

        </section>

        {/* CTA */}

        <section className="bg-[#0B2F24] text-white">

          <div className="mx-auto max-w-7xl px-6 py-16 text-center">

            <h2 className="text-3xl font-bold md:text-4xl">
              Looking for a Crusher or Screening Plant?
            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-lg leading-8 text-gray-300">
              Contact NEWTA Commercial Sales if you are looking for
              a particular mobile crusher, screening plant or other
              crushing and screening equipment.
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