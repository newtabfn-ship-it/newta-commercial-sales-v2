import type { Metadata } from "next";
import Link from "next/link";

import connectDB from "@/lib/mongodb";
import Equipment from "@/models/Equipment";

import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import EquipmentCard from "../../components/EquipmentCard";
import { equipmentCategories } from "@/app/data/categories";

const SITE_URL = "https://newtacommercialsales.com";

export const metadata: Metadata = {
  title: "Trucks for Sale South Africa | NEWTA Commercial Sales",

  description:
    "Browse trucks for sale in South Africa through NEWTA Commercial Sales. Find 2 ton, 3 ton, 4 ton, 8 ton, 10 ton, 12 ton, 14 ton and 16 ton trucks, dropside trucks, flatdeck trucks and other commercial trucks.",

  alternates: {
    canonical:
      `${SITE_URL}/equipment/trucks-for-sale-south-africa`,
  },

  openGraph: {
    title: "Trucks for Sale South Africa | NEWTA Commercial Sales",

    description:
      "Browse commercial trucks for sale across South Africa through NEWTA Commercial Sales, including different truck types, body configurations and tonnage classes.",

    url:
      `${SITE_URL}/equipment/trucks-for-sale-south-africa`,

    type: "website",

    siteName: "NEWTA Commercial Sales",

    locale: "en_ZA",
  },

  twitter: {
    card: "summary_large_image",

    title: "Trucks for Sale South Africa | NEWTA Commercial Sales",

    description:
      "Browse trucks for sale in South Africa through NEWTA Commercial Sales, including different truck types and tonnage classes.",
  },
};

const tonnagePages = [
  {
    title: "2 Ton Trucks",
    description:
      "Smaller commercial trucks suitable for local deliveries, business transport and general cargo.",
    href: "/equipment/2-ton-trucks-for-sale-south-africa",
  },
  {
    title: "3 Ton Trucks",
    description:
      "Practical commercial trucks for deliveries, transport businesses, materials and general freight.",
    href: "/equipment/3-ton-trucks-for-sale-south-africa",
  },
  {
    title: "4 Ton Trucks",
    description:
      "Medium-sized trucks suitable for business deliveries, materials, equipment and general commercial transport.",
    href: "/equipment/4-ton-trucks-for-sale-south-africa",
  },
  {
    title: "8 Ton Trucks",
    description:
      "Versatile commercial trucks capable of carrying heavier materials, equipment and general freight.",
    href: "/equipment/8-ton-trucks-for-sale-south-africa",
  },
  {
    title: "10 Ton Trucks",
    description:
      "Larger commercial trucks for transporting heavier loads, materials, equipment and general freight.",
    href: "/equipment/10-ton-trucks-for-sale-south-africa",
  },
  {
    title: "12 Ton Trucks",
    description:
      "Heavy commercial trucks suitable for transport, construction, industrial and material-handling applications.",
    href: "/equipment/12-ton-trucks-for-sale-south-africa",
  },
  {
    title: "14 Ton Trucks",
    description:
      "Heavy-duty commercial trucks designed for larger loads and demanding transport applications.",
    href: "/equipment/14-ton-trucks-for-sale-south-africa",
  },
  {
    title: "16 Ton Trucks",
    description:
      "Large commercial trucks suitable for heavy transport, construction materials, industrial freight and other demanding applications.",
    href: "/equipment/16-ton-trucks-for-sale-south-africa",
  },
];

const truckTypes = [
  {
    title: "Dropside Trucks",
    description:
      "Dropside trucks provide practical loading access and are commonly used for deliveries, building materials, equipment, agricultural goods and general freight.",
    href: "/equipment/dropside-trucks-for-sale-south-africa",
  },
  {
    title: "Flatdeck Trucks",
    description:
      "Flatdeck trucks offer an open load area for transporting machinery, equipment, materials, pallets and other commercial cargo.",
    href: "/equipment/flatdeck-trucks-for-sale-south-africa",
  },
  {
    title: "Crane Trucks",
    description:
      "Crane trucks combine cargo transport with lifting capability and can be used for construction, industrial, material handling and equipment transport.",
    href: "/equipment/crane-trucks-for-sale-south-africa",
  },
  {
    title: "Cement Mixer Trucks",
    description:
      "Mixer trucks are designed for transporting and mixing concrete and are commonly used in construction and concrete supply operations.",
    href: "/equipment/cement-mixer-trucks-for-sale-south-africa",
  },
  {
    title: "Truck Tractors",
    description:
      "Truck tractors are designed to pull semi-trailers and are widely used in long-distance, regional and heavy commercial transport.",
    href: "/equipment/truck-tractors-for-sale-south-africa",
  },
  {
    title: "Other Commercial Trucks",
    description:
      "NEWTA also offers other commercial truck configurations depending on current stock and seller requirements.",
    href: "/equipment/other-trucks-for-sale-south-africa",
  },
];

const truckUses = [
  "Local and regional deliveries",
  "General freight transport",
  "Building and construction materials",
  "Agricultural transport",
  "Industrial equipment transport",
  "Machinery and material transport",
  "Retail and business distribution",
  "Heavy commercial transport",
];

export default async function TrucksForSaleSouthAfrica() {
  await connectDB();

  const commercialVehicles = equipmentCategories.find(
    (category) => category.slug === "commercial-vehicles"
  );

  const truckSubcategories =
  commercialVehicles?.subcategories
    .filter((subcategory) => subcategory.group === "trucks")
    .map((subcategory) => subcategory.name) ?? [];

const equipment = await Equipment.find({
  category: commercialVehicles?.name,
  subcategory: { $in: truckSubcategories },
  status: "Available",
})
  .sort({ createdAt: -1 })
  .lean();

  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",

        name: "Trucks for Sale South Africa",

        description:
          "Commercial trucks for sale in South Africa through NEWTA Commercial Sales, including dropside trucks, flatdeck trucks, crane trucks, mixer trucks, truck tractors and trucks in various tonnage classes.",

        url:
          `${SITE_URL}/equipment/trucks-for-sale-south-africa`,

        isPartOf: {
          "@type": "WebSite",
          name: "NEWTA Commercial Sales",
          url: SITE_URL,
        },

        mainEntity: {
          "@type": "ItemList",

          numberOfItems: equipment.length,

          itemListElement: equipment.map((item, index) => ({
            "@type": "ListItem",

            position: index + 1,

            name: item.title,

            url: `${SITE_URL}/equipment/${item.slug}`,
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
            item: SITE_URL,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Equipment",
            item: `${SITE_URL}/equipment`,
          },
          {
            "@type": "ListItem",
            position: 3,
            name: "Trucks for Sale South Africa",
            item:
              `${SITE_URL}/equipment/trucks-for-sale-south-africa`,
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
                Trucks for Sale South Africa
              </span>
            </nav>

            <span className="inline-block rounded-full bg-[#D4AF37] px-5 py-2 text-sm font-bold uppercase tracking-wider text-[#0B2F24]">
              Private Treaty Sales
            </span>

            <h1 className="mt-6 max-w-5xl text-4xl font-extrabold leading-tight md:text-6xl">
              Trucks for Sale South Africa
            </h1>

            <p className="mt-6 max-w-4xl text-lg leading-8 text-gray-200 md:text-xl">
              Browse commercial trucks for sale across South Africa
              through NEWTA Commercial Sales. Our truck inventory
              includes different truck types, body configurations and
              tonnage classes for transport, construction, agriculture,
              industry, deliveries and general commercial work.
            </p>

          </div>

        </section>

        {/* INTRODUCTION */}

        <section className="mx-auto max-w-7xl px-6 py-16">

          <div className="max-w-4xl">

            <h2 className="text-3xl font-bold text-[#0B2F24] md:text-4xl">
              Commercial Trucks for Sale
            </h2>

            <p className="mt-5 text-lg leading-8 text-gray-600">
              NEWTA Commercial Sales offers commercial trucks through
              Private Treaty Sales across South Africa. Our available
              trucks can range from smaller delivery vehicles through
              to larger trucks designed for heavier commercial loads.
            </p>

            <p className="mt-5 text-lg leading-8 text-gray-600">
              Depending on current availability, buyers may find
              dropside trucks, flatdeck trucks, crane trucks, mixer
              trucks, truck tractors and other commercial trucks.
              Trucks are available in different tonnage classes and
              specifications depending on the individual asset.
            </p>

            <p className="mt-5 text-lg leading-8 text-gray-600">
              Browse the current NEWTA truck listings below to view
              photographs, specifications, pricing, location and
              enquiry information.
            </p>

          </div>

        </section>

        {/* COMMON USES */}

        <section className="border-t bg-white">

          <div className="mx-auto max-w-7xl px-6 py-16">

            <h2 className="text-3xl font-bold text-[#0B2F24] md:text-4xl">
              Commercial Truck Applications
            </h2>

            <p className="mt-4 max-w-4xl text-lg leading-8 text-gray-600">
              Commercial trucks are used across many South African
              industries. The correct truck depends on the load,
              body configuration, operating environment and required
              carrying capacity.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

              {truckUses.map((use) => (
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

        {/* TRUCK TYPES */}

        <section className="bg-[#FAF8F2]">

          <div className="mx-auto max-w-7xl px-6 py-16">

            <h2 className="text-3xl font-bold text-[#0B2F24] md:text-4xl">
              Truck Types for Sale in South Africa
            </h2>

            <p className="mt-4 max-w-4xl text-lg leading-8 text-gray-600">
              Explore different commercial truck configurations
              available through NEWTA Commercial Sales. Availability
              changes as trucks are sold and new assets are added.
            </p>

            <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">

              {truckTypes.map((truck) => (
                <Link
                  key={truck.href}
                  href={truck.href}
                  className="group rounded-2xl border bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                >
                  <h3 className="text-xl font-bold text-[#0B2F24] group-hover:text-green-800">
                    {truck.title}
                  </h3>

                  <p className="mt-3 leading-7 text-gray-600">
                    {truck.description}
                  </p>

                  <span className="mt-5 inline-block font-bold text-[#D4AF37]">
                    View {truck.title} →
                  </span>
                </Link>
              ))}

            </div>

          </div>

        </section>

        {/* TONNAGE */}

        <section className="border-t bg-white">

          <div className="mx-auto max-w-7xl px-6 py-16">

            <h2 className="text-3xl font-bold text-[#0B2F24] md:text-4xl">
              Trucks by Tonnage
            </h2>

            <p className="mt-4 max-w-4xl text-lg leading-8 text-gray-600">
              NEWTA Commercial Sales has dedicated pages for different
              truck tonnage classes. These pages provide more
              information about the type of work each truck size can
              be suited to and show available listings where stock is
              available.
            </p>

            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">

              {tonnagePages.map((truck) => (
                <Link
                  key={truck.href}
                  href={truck.href}
                  className="group rounded-2xl border bg-[#FAF8F2] p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                >
                  <h3 className="text-xl font-bold text-[#0B2F24] group-hover:text-green-800">
                    {truck.title}
                  </h3>

                  <p className="mt-3 text-gray-600">
                    {truck.description}
                  </p>

                  <span className="mt-5 inline-block font-bold text-[#D4AF37]">
                    View {truck.title} →
                  </span>
                </Link>
              ))}

            </div>

          </div>

        </section>

        {/* CURRENT LISTINGS */}

        <section className="mx-auto max-w-7xl px-6 py-16">

          <div className="max-w-4xl">

            <h2 className="text-3xl font-bold text-[#0B2F24] md:text-4xl">
              Trucks Currently for Sale
            </h2>

            <p className="mt-4 text-lg leading-8 text-gray-600">
              View the commercial trucks currently available through
              NEWTA Commercial Sales. Each listing includes available
              photographs, specifications, pricing and enquiry
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
                No trucks currently available
              </h2>

              <p className="mt-3 text-gray-600">
                Please check back soon for new commercial truck
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

        {/* RELATED COMMERCIAL VEHICLES */}

        <section className="bg-[#FAF8F2]">

          <div className="mx-auto max-w-7xl px-6 py-16">

            <h2 className="text-3xl font-bold text-[#0B2F24] md:text-4xl">
              More Commercial Vehicles
            </h2>

            <p className="mt-4 max-w-4xl text-lg leading-8 text-gray-600">
              If you are looking for more than trucks, NEWTA
              Commercial Sales also offers bakkies, buses, cars,
              trailers, truck tractors and other commercial vehicles
              depending on current availability.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">

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

              <Link
                href="/equipment/bakkies-for-sale-south-africa"
                className="rounded-xl bg-[#0B2F24] px-6 py-3 font-bold text-white transition hover:bg-green-900"
              >
                Bakkies
              </Link>

              <Link
                href="/equipment/buses-for-sale-south-africa"
                className="rounded-xl bg-[#0B2F24] px-6 py-3 font-bold text-white transition hover:bg-green-900"
              >
                Buses
              </Link>

            </div>

          </div>

        </section>

        {/* CTA */}

        <section className="bg-[#0B2F24] text-white">

          <div className="mx-auto max-w-7xl px-6 py-16 text-center">

            <h2 className="text-3xl font-bold md:text-4xl">
              Looking for a Specific Truck?
            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-lg leading-8 text-gray-300">
              Contact NEWTA Commercial Sales if you are looking for
              a particular truck, tonnage class or commercial vehicle,
              or if you want more information about an available
              asset.
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