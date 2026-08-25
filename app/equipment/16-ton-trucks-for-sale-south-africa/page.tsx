import type { Metadata } from "next";
import Link from "next/link";

import connectDB from "@/lib/mongodb";
import Equipment from "@/models/Equipment";

import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import EquipmentCard from "../../components/EquipmentCard";
import { equipmentCategories } from "@/app/data/categories";

export const metadata: Metadata = {
  title:
    "16 Ton Trucks for Sale South Africa | NEWTA Commercial Sales",

  description:
    "Browse 16 ton trucks for sale in South Africa through NEWTA Commercial Sales. View available 16 ton commercial trucks with specifications, photographs, pricing and enquiry information.",

  alternates: {
    canonical:
      "https://newtacommercialsales.com/equipment/16-ton-trucks-for-sale-south-africa",
  },

  openGraph: {
    title:
      "16 Ton Trucks for Sale South Africa | NEWTA Commercial Sales",

    description:
      "Browse 16 ton trucks currently available through NEWTA Commercial Sales across South Africa. View specifications, photographs, pricing and enquiry information.",

    url:
      "https://newtacommercialsales.com/equipment/16-ton-trucks-for-sale-south-africa",

    type: "website",

    siteName: "NEWTA Commercial Sales",

    locale: "en_ZA",
  },

  twitter: {
    card: "summary_large_image",

    title:
      "16 Ton Trucks for Sale South Africa | NEWTA Commercial Sales",

    description:
      "Browse available 16 ton trucks through NEWTA Commercial Sales across South Africa.",
  },
};

export default async function SixteenTonTrucksPage() {
  await connectDB();

  const commercialVehicles = equipmentCategories.find(
    (category) => category.slug === "commercial-vehicles"
  );

  const sixteenTonTrucks = commercialVehicles?.subcategories.find(
    (subcategory) => subcategory.slug === "16-ton-trucks"
  );

  const equipment = await Equipment.find({
    category: commercialVehicles?.name,
    subcategory: sixteenTonTrucks?.name,
    status: "Available",
  })
    .sort({ createdAt: -1 })
    .lean();

  const pageUrl =
    "https://newtacommercialsales.com/equipment/16-ton-trucks-for-sale-south-africa";

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",

    name: "16 Ton Trucks for Sale South Africa",

    description:
      "16 ton trucks for sale through NEWTA Commercial Sales across South Africa.",

    url: pageUrl,

    isPartOf: {
      "@type": "WebSite",
      name: "NEWTA Commercial Sales",
      url: "https://newtacommercialsales.com",
    },

    breadcrumb: {
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
          name: "16 Ton Trucks for Sale South Africa",
          item: pageUrl,
        },
      ],
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
                href="/equipment/trucks-for-sale-south-africa"
                className="hover:text-[#D4AF37]"
              >
                Trucks for Sale South Africa
              </Link>

              <span className="mx-2">
                /
              </span>

              <span className="text-[#D4AF37]">
                16 Ton Trucks
              </span>

            </nav>

            <span className="inline-block rounded-full bg-[#D4AF37] px-5 py-2 text-sm font-bold uppercase tracking-wider text-[#0B2F24]">
              Private Treaty Sales
            </span>

            <h1 className="mt-6 max-w-5xl text-4xl font-extrabold leading-tight md:text-6xl">
              16 Ton Trucks for Sale South Africa
            </h1>

            <p className="mt-6 max-w-4xl text-lg leading-8 text-gray-200 md:text-xl">
              Browse 16 ton trucks currently available through
              NEWTA Commercial Sales. View truck specifications,
              photographs, pricing and enquiry information for
              available 16 ton commercial trucks across South Africa.
            </p>

          </div>

        </section>

        {/* INTRODUCTION */}

        <section className="mx-auto max-w-7xl px-6 py-16">

          <div className="max-w-4xl">

            <h2 className="text-3xl font-bold text-[#0B2F24] md:text-4xl">
              16 Ton Trucks for Sale
            </h2>

            <p className="mt-5 text-lg leading-8 text-gray-600">
              NEWTA Commercial Sales offers commercial vehicles
              through Private Treaty Sales. Our 16 ton truck
              listings provide buyers with access to available
              commercial trucks with photographs, specifications,
              pricing and enquiry information shown on each asset
              listing.
            </p>

            <p className="mt-5 text-lg leading-8 text-gray-600">
              Browse the current 16 ton trucks below and select an
              asset to view its full details or submit an enquiry
              directly to NEWTA Commercial Sales.
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
                No 16 ton trucks currently available
              </h2>

              <p className="mt-3 text-gray-600">
                Please check back soon for new 16 ton truck
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

        {/* BUYER INFORMATION */}

        <section className="border-t bg-white">

          <div className="mx-auto max-w-7xl px-6 py-16">

            <div className="grid gap-8 md:grid-cols-3">

              <div className="rounded-2xl border p-6 shadow-sm">

                <h3 className="text-xl font-bold text-[#0B2F24]">
                  16 Ton Commercial Trucks
                </h3>

                <p className="mt-3 text-gray-600">
                  Browse available 16 ton commercial trucks suitable
                  for a range of transport, delivery and business
                  applications.
                </p>

              </div>

              <div className="rounded-2xl border p-6 shadow-sm">

                <h3 className="text-xl font-bold text-[#0B2F24]">
                  View Specifications
                </h3>

                <p className="mt-3 text-gray-600">
                  Review the available specifications, condition,
                  photographs and other information provided for
                  each 16 ton truck.
                </p>

              </div>

              <div className="rounded-2xl border p-6 shadow-sm">

                <h3 className="text-xl font-bold text-[#0B2F24]">
                  Private Treaty Sales
                </h3>

                <p className="mt-3 text-gray-600">
                  Enquire directly with NEWTA Commercial Sales
                  about an available 16 ton truck and receive
                  further information about the asset.
                </p>

              </div>

            </div>

          </div>

        </section>

        {/* RELATED TRUCKS */}

        <section className="bg-[#FAF8F2]">

          <div className="mx-auto max-w-7xl px-6 py-16">

            <h2 className="text-3xl font-bold text-[#0B2F24]">
              More Trucks for Sale
            </h2>

            <p className="mt-4 max-w-3xl text-lg text-gray-600">
              Looking for another size or type of commercial truck?
              Browse the full NEWTA truck inventory.
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
              Looking for a 16 Ton Truck?
            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-300">
              Contact NEWTA Commercial Sales if you are looking
              for a particular 16 ton truck or want more information
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