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
    "Buses for Sale South Africa | NEWTA Commercial Sales",

  description:
    "Browse buses for sale in South Africa through NEWTA Commercial Sales. Find passenger buses and commercial buses for transport, staff transport, schools, tourism and other commercial applications, with specifications, images, pricing and enquiry information.",

  alternates: {
    canonical:
      "https://newtacommercialsales.com/equipment/buses-for-sale-south-africa",
  },

  openGraph: {
    title:
      "Buses for Sale South Africa | NEWTA Commercial Sales",

    description:
      "Browse buses currently available through NEWTA Commercial Sales across South Africa, including passenger and commercial buses for a range of transport applications.",

    url:
      "https://newtacommercialsales.com/equipment/buses-for-sale-south-africa",

    type: "website",

    siteName: "NEWTA Commercial Sales",

    locale: "en_ZA",
  },

  twitter: {
    card: "summary_large_image",

    title:
      "Buses for Sale South Africa | NEWTA Commercial Sales",

    description:
      "Browse available buses through NEWTA Commercial Sales.",
  },
};

export default async function BusesForSalePage() {
  await connectDB();

  const commercialVehicles = equipmentCategories.find(
    (category) => category.slug === "commercial-vehicles"
  );

  const buses = commercialVehicles?.subcategories.find(
    (subcategory) => subcategory.slug === "buses"
  );

  const equipment = await Equipment.find({
    category: commercialVehicles?.name,
    subcategory: buses?.name,
    status: "Available",
  })
    .sort({ createdAt: -1 })
    .lean();

  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",

        name: "Buses for Sale South Africa",

        description:
          "Buses for sale in South Africa through NEWTA Commercial Sales, including passenger and commercial buses for transport, staff transport, schools, tourism and other commercial applications.",

        url:
          "https://newtacommercialsales.com/equipment/buses-for-sale-south-africa",

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
            name: "Buses for Sale South Africa",
            item:
              "https://newtacommercialsales.com/equipment/buses-for-sale-south-africa",
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

              <span className="text-[#D4AF37]">
                Buses for Sale South Africa
              </span>
            </nav>

            <span className="inline-block rounded-full bg-[#D4AF37] px-5 py-2 text-sm font-bold uppercase tracking-wider text-[#0B2F24]">
              Private Treaty Sales
            </span>

            <h1 className="mt-6 max-w-5xl text-4xl font-extrabold leading-tight md:text-6xl">
              Buses for Sale South Africa
            </h1>

            <p className="mt-6 max-w-4xl text-lg leading-8 text-gray-200 md:text-xl">
              Browse buses for sale across South Africa through NEWTA
              Commercial Sales. Find passenger and commercial buses
              suitable for staff transport, schools, tourism, passenger
              transport and other commercial applications.
            </p>

          </div>

        </section>

        {/* INTRODUCTION */}

        <section className="mx-auto max-w-7xl px-6 py-16">

          <div className="max-w-4xl">

            <h2 className="text-3xl font-bold text-[#0B2F24] md:text-4xl">
              Commercial Buses for Sale
            </h2>

            <p className="mt-5 text-lg leading-8 text-gray-600">
              NEWTA Commercial Sales offers buses and other commercial
              vehicles through Private Treaty Sales across South Africa.
              Our bus listings provide buyers with access to available
              passenger and commercial bus assets, with photographs,
              specifications and pricing information shown on each
              individual listing.
            </p>

            <p className="mt-5 text-lg leading-8 text-gray-600">
              Buses can be used for staff transport, school transport,
              passenger services, tourism, shuttle operations and other
              commercial transport requirements. The correct bus depends
              on its configuration, passenger capacity, condition and
              intended application.
            </p>

            <p className="mt-5 text-lg leading-8 text-gray-600">
              Browse the current NEWTA bus listings below to view
              photographs, specifications, pricing, location and
              enquiry information.
            </p>

          </div>

        </section>

        {/* APPLICATIONS */}

        <section className="border-t bg-white">

          <div className="mx-auto max-w-7xl px-6 py-16">

            <h2 className="text-3xl font-bold text-[#0B2F24] md:text-4xl">
              Bus Applications
            </h2>

            <p className="mt-4 max-w-4xl text-lg leading-8 text-gray-600">
              Commercial buses are used across South Africa for a range
              of passenger transport requirements. Applications depend
              on the individual bus, seating configuration, condition
              and operating requirements.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

              {[
                "Staff transport",
                "School transport",
                "Passenger transport",
                "Tourism operations",
                "Shuttle services",
                "Corporate transport",
                "Community transport",
                "Commercial passenger services",
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
              Buses Currently for Sale
            </h2>

            <p className="mt-4 text-lg leading-8 text-gray-600">
              View buses currently available through NEWTA Commercial
              Sales. Each listing includes available photographs,
              specifications, pricing, location and enquiry
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
                No buses currently available
              </h2>

              <p className="mt-3 text-gray-600">
                Please check back soon for new bus listings.
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
                  Passenger Buses
                </h3>

                <p className="mt-3 text-gray-600">
                  Browse passenger buses suitable for staff transport,
                  schools, tourism, shuttle services and other
                  passenger transport applications.
                </p>

              </div>

              <div className="rounded-2xl border p-6 shadow-sm">

                <h3 className="text-xl font-bold text-[#0B2F24]">
                  View Full Details
                </h3>

                <p className="mt-3 text-gray-600">
                  Each bus listing includes available photographs,
                  specifications, pricing, location and enquiry
                  information.
                </p>

              </div>

              <div className="rounded-2xl border p-6 shadow-sm">

                <h3 className="text-xl font-bold text-[#0B2F24]">
                  Private Treaty Sales
                </h3>

                <p className="mt-3 text-gray-600">
                  Contact NEWTA Commercial Sales directly about an
                  available bus or another commercial asset.
                </p>

              </div>

            </div>

          </div>

        </section>

        {/* RELATED COMMERCIAL VEHICLES */}

        <section className="bg-[#FAF8F2]">

          <div className="mx-auto max-w-7xl px-6 py-16">

            <h2 className="text-3xl font-bold text-[#0B2F24] md:text-4xl">
              More Commercial Vehicles
            </h2>

            <p className="mt-4 max-w-4xl text-lg leading-8 text-gray-600">
              Looking for another commercial vehicle? Browse the full
              NEWTA inventory, including trucks, truck tractors,
              trailers and other commercial vehicles.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">

              <Link
                href="/equipment/trucks-for-sale-south-africa"
                className="rounded-xl bg-[#0B2F24] px-6 py-3 font-bold text-white transition hover:bg-green-900"
              >
                Trucks for Sale
              </Link>

              <Link
                href="/equipment/trailers-for-sale-south-africa"
                className="rounded-xl bg-[#0B2F24] px-6 py-3 font-bold text-white transition hover:bg-green-900"
              >
                Trailers for Sale
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
              Looking for a Bus?
            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-lg leading-8 text-gray-300">
              Contact NEWTA Commercial Sales if you are looking for
              a particular bus or want more information about an
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