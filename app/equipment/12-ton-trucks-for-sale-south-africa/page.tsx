import type { Metadata } from "next";
import Link from "next/link";

import connectDB from "@/lib/mongodb";
import Equipment from "@/models/Equipment";

import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import EquipmentCard from "../../components/EquipmentCard";
import { equipmentCategories } from "@/app/data/categories";

const pageUrl =
  "https://newtacommercialsales.com/equipment/12-ton-trucks-for-sale-south-africa";

export const metadata: Metadata = {
  title: "12 Ton Trucks for Sale South Africa | NEWTA Commercial Sales",

  description:
    "Browse 12 ton trucks for sale in South Africa through NEWTA Commercial Sales. View available commercial trucks including dropside, flatdeck and other 12 ton trucks offered through Private Treaty Sales.",

  alternates: {
    canonical: pageUrl,
  },

  openGraph: {
    title: "12 Ton Trucks for Sale South Africa | NEWTA Commercial Sales",

    description:
      "Browse 12 ton trucks for sale in South Africa through NEWTA Commercial Sales.",

    url: pageUrl,

    type: "website",

    siteName: "NEWTA Commercial Sales",

    locale: "en_ZA",
  },

  twitter: {
    card: "summary_large_image",

    title: "12 Ton Trucks for Sale South Africa | NEWTA Commercial Sales",

    description:
      "Browse 12 ton trucks for sale in South Africa through NEWTA Commercial Sales.",
  },
};

export default async function TwelveTonTrucksForSaleSouthAfrica() {
  await connectDB();

  const commercialVehicles = equipmentCategories.find(
    (category) => category.slug === "commercial-vehicles"
  );

  const twelveTonTrucks = commercialVehicles?.subcategories.find(
    (subcategory) => subcategory.slug === "12-ton-trucks"
  );

  const equipment = await Equipment.find({
    category: "Commercial Vehicles",
    subcategory: twelveTonTrucks?.name,
    status: "Available",
  })
    .sort({ createdAt: -1 })
    .lean();

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",

    name: "12 Ton Trucks for Sale South Africa",

    description:
      "12 ton commercial trucks for sale through NEWTA Commercial Sales.",

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
          name: "12 Ton Trucks for Sale South Africa",
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
                12 Ton Trucks
              </span>
            </nav>

            <span className="inline-block rounded-full bg-[#D4AF37] px-5 py-2 text-sm font-bold uppercase tracking-wider text-[#0B2F24]">
              Private Treaty Sales
            </span>

            <h1 className="mt-6 max-w-4xl text-4xl font-extrabold leading-tight md:text-6xl">
              12 Ton Trucks for Sale South Africa
            </h1>

            <p className="mt-6 max-w-4xl text-lg leading-8 text-gray-200 md:text-xl">
              Browse 12 ton trucks for sale in South Africa through
              NEWTA Commercial Sales. Our listings can include
              dropside trucks, flatdeck trucks and other commercial
              trucks suitable for transport, deliveries, construction
              and general business use.
            </p>

          </div>

        </section>

        {/* LISTINGS */}

        <section className="mx-auto max-w-7xl px-6 py-16">

          <div className="max-w-4xl">

            <h2 className="text-3xl font-bold text-[#0B2F24] md:text-4xl">
              12 Ton Trucks for Sale
            </h2>

            <p className="mt-5 text-lg leading-8 text-gray-600">
              View current 12 ton truck listings available through
              NEWTA Commercial Sales. Each listing provides available
              specifications, photographs, pricing and enquiry
              information.
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
                No 12 Ton Trucks Currently Available
              </h2>

              <p className="mt-3 text-gray-600">
                We do not currently have a 12 ton truck listed for
                sale. Please check back soon or contact NEWTA
                Commercial Sales if you are looking for a specific
                truck.
              </p>

              <Link
                href="/contact"
                className="mt-6 inline-block rounded-xl bg-[#D4AF37] px-6 py-3 font-bold text-[#0B2F24]"
              >
                Contact NEWTA
              </Link>

            </div>

          )}

        </section>

        {/* TRUCK TYPES */}

        <section className="border-t bg-white">

          <div className="mx-auto max-w-7xl px-6 py-16">

            <h2 className="text-3xl font-bold text-[#0B2F24] md:text-4xl">
              12 Ton Truck Types
            </h2>

            <p className="mt-4 max-w-4xl text-lg leading-8 text-gray-600">
              Depending on availability, 12 ton trucks may be available
              in different body configurations and specifications.
              Browse the truck types below or view the wider NEWTA
              commercial truck range.
            </p>

            <div className="mt-8 grid gap-6 md:grid-cols-3">

              <Link
                href="/equipment/dropside-trucks-for-sale-south-africa"
                className="rounded-2xl border bg-[#FAF8F2] p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                <h3 className="text-xl font-bold text-[#0B2F24]">
                  Dropside Trucks
                </h3>

                <p className="mt-3 text-gray-600">
                  View dropside trucks available through NEWTA
                  Commercial Sales.
                </p>
              </Link>

              <Link
                href="/equipment/flatdeck-trucks-for-sale-south-africa"
                className="rounded-2xl border bg-[#FAF8F2] p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                <h3 className="text-xl font-bold text-[#0B2F24]">
                  Flatdeck Trucks
                </h3>

                <p className="mt-3 text-gray-600">
                  View flatdeck trucks available through NEWTA
                  Commercial Sales.
                </p>
              </Link>

              <Link
                href="/equipment/trucks-for-sale-south-africa"
                className="rounded-2xl border bg-[#FAF8F2] p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                <h3 className="text-xl font-bold text-[#0B2F24]">
                  All Trucks
                </h3>

                <p className="mt-3 text-gray-600">
                  Browse the full range of commercial trucks offered
                  through NEWTA Commercial Sales.
                </p>
              </Link>

            </div>

          </div>

        </section>

        {/* WHAT ARE 12 TON TRUCKS */}

        <section className="bg-[#FAF8F2]">

          <div className="mx-auto max-w-7xl px-6 py-16">

            <div className="max-w-4xl">

              <h2 className="text-3xl font-bold text-[#0B2F24] md:text-4xl">
                What Are 12 Ton Trucks?
              </h2>

                             <p className="mt-5 text-lg leading-8 text-gray-600">
  12 ton trucks are heavy-duty commercial vehicles designed for
  transporting larger and heavier loads than lighter delivery
  trucks. They are commonly used for transporting building
  materials, construction equipment, agricultural products,
  machinery, general freight and other commercial loads where
  greater payload capacity is required.
              </p>

             <p className="mt-5 text-lg leading-8 text-gray-600">
  Depending on the truck configuration, body type and vehicle
  specification, 12 ton trucks can be used for a wide range of
  commercial transport applications. Buyers should always check
  the individual vehicle's specifications, permitted payload and
  documentation before purchase.
</p>

            </div>

          </div>

        </section>

        {/* COMMON USES */}

        <section className="border-t bg-white">

          <div className="mx-auto max-w-7xl px-6 py-16">

            <h2 className="text-3xl font-bold text-[#0B2F24] md:text-4xl">
              Common Uses for 12 Ton Trucks
            </h2>

            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

             {[
  "Building materials",
  "Construction equipment",
  "Agricultural products",
  "Heavy general freight",
  "Machinery and equipment",
  "Industrial transport",
].map((use) => (

                <div
                  key={use}
                  className="rounded-xl border bg-[#FAF8F2] p-5"
                >
                  <p className="font-semibold text-[#0B2F24]">
                    {use}
                  </p>
                </div>

              ))}

            </div>

          </div>

        </section>

        {/* OTHER TONNAGE PAGES */}

        <section className="border-t bg-[#FAF8F2]">

          <div className="mx-auto max-w-7xl px-6 py-16">

            <h2 className="text-3xl font-bold text-[#0B2F24] md:text-4xl">
              Other Truck Tonnages
            </h2>

            <p className="mt-4 max-w-4xl text-lg leading-8 text-gray-600">
              Looking for a different truck size? Browse other truck
              tonnage categories available through NEWTA Commercial
              Sales.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">

              {[
                ["2 Ton Trucks", "/equipment/3-ton-trucks-for-sale-south-africa"],
                ["3 Ton Trucks", "/equipment/4-ton-trucks-for-sale-south-africa"],
                ["4 Ton Trucks", "/equipment/8-ton-trucks-for-sale-south-africa"],
                ["8 Ton Trucks", "/equipment/10-ton-trucks-for-sale-south-africa"],
                ["10 Ton Trucks", "/equipment/12-ton-trucks-for-sale-south-africa"],
                ["14 Ton Trucks", "/equipment/14-ton-trucks-for-sale-south-africa"],
                ["16 Ton Trucks", "/equipment/16-ton-trucks-for-sale-south-africa"],
              ].map(([label, href]) => (

                <Link
                  key={href}
                  href={href}
                  className="rounded-xl border bg-white px-5 py-3 font-semibold text-[#0B2F24] transition hover:border-[#D4AF37] hover:bg-[#D4AF37]"
                >
                  {label}
                </Link>

              ))}

            </div>

          </div>

        </section>

        {/* CTA */}

        <section className="bg-[#0B2F24] text-white">

          <div className="mx-auto max-w-7xl px-6 py-16 text-center">

            <h2 className="text-3xl font-bold md:text-4xl">
              Looking for a 12 Ton Truck?
            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-300">
              If you are looking for a particular 12 ton truck, body
              type or specification, contact NEWTA Commercial Sales.
              We can assist with available commercial vehicles and
              upcoming stock.
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