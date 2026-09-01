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
    "Cars for Sale South Africa | NEWTA Commercial Sales",

  description:
    "Browse cars and passenger vehicles for sale in South Africa through NEWTA Commercial Sales. Find passenger cars and commercial vehicles for business, personal, fleet and general transport use, with specifications, images, pricing and enquiry information.",

  alternates: {
    canonical:
      "https://newtacommercialsales.com/equipment/cars-for-sale-south-africa",
  },

  openGraph: {
    title:
      "Cars for Sale South Africa | NEWTA Commercial Sales",

    description:
      "Browse cars and passenger vehicles currently available through NEWTA Commercial Sales across South Africa, including vehicles for personal, business, fleet and general transport applications.",

    url:
      "https://newtacommercialsales.com/equipment/cars-for-sale-south-africa",

    type: "website",

    siteName: "NEWTA Commercial Sales",

    locale: "en_ZA",
  },

  twitter: {
    card: "summary_large_image",

    title:
      "Cars for Sale South Africa | NEWTA Commercial Sales",

    description:
      "Browse available cars and passenger vehicles through NEWTA Commercial Sales.",
  },
};

export default async function CarsForSalePage() {
  await connectDB();

  const commercialVehicles = equipmentCategories.find(
    (category) => category.slug === "commercial-vehicles"
  );

  const cars = commercialVehicles?.subcategories.find(
    (subcategory) => subcategory.slug === "cars-passenger-vehicles"
  );

  const equipment = await Equipment.find({
    category: commercialVehicles?.name,
    subcategory: cars?.name,
    status: "Available",
  })
    .sort({ createdAt: -1 })
    .lean();

  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",

        name: "Cars for Sale South Africa",

        description:
          "Cars and passenger vehicles for sale in South Africa through NEWTA Commercial Sales, including passenger cars and vehicles suitable for personal, business, fleet and general transport applications.",

        url:
          "https://newtacommercialsales.com/equipment/cars-for-sale-south-africa",

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
            name: "Cars for Sale South Africa",
            item:
              "https://newtacommercialsales.com/equipment/cars-for-sale-south-africa",
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
                Cars for Sale South Africa
              </span>
            </nav>

            <span className="inline-block rounded-full bg-[#D4AF37] px-5 py-2 text-sm font-bold uppercase tracking-wider text-[#0B2F24]">
              Private Treaty Sales
            </span>

            <h1 className="mt-6 max-w-5xl text-4xl font-extrabold leading-tight md:text-6xl">
              Cars for Sale South Africa
            </h1>

            <p className="mt-6 max-w-4xl text-lg leading-8 text-gray-200 md:text-xl">
              Browse cars and passenger vehicles for sale across South
              Africa through NEWTA Commercial Sales. Find available
              passenger vehicles suitable for personal use, business,
              fleet operations and general transport requirements.
            </p>

          </div>

        </section>

        {/* INTRODUCTION */}

        <section className="mx-auto max-w-7xl px-6 py-16">

          <div className="max-w-4xl">

            <h2 className="text-3xl font-bold text-[#0B2F24] md:text-4xl">
              Cars and Passenger Vehicles for Sale
            </h2>

            <p className="mt-5 text-lg leading-8 text-gray-600">
              NEWTA Commercial Sales offers cars and passenger vehicles
              through Private Treaty Sales across South Africa. Our
              vehicle listings provide buyers with access to available
              cars, with photographs, specifications and pricing
              information shown on each individual listing.
            </p>

            <p className="mt-5 text-lg leading-8 text-gray-600">
              Passenger vehicles can be suitable for private use,
              business travel, fleet operations, company vehicles and
              general transport. The correct vehicle depends on the
              individual vehicle, condition, specifications and intended
              use.
            </p>

            <p className="mt-5 text-lg leading-8 text-gray-600">
              Browse the current NEWTA car listings below to view
              photographs, specifications, pricing, location and
              enquiry information.
            </p>

          </div>

        </section>

        {/* VEHICLE APPLICATIONS */}

        <section className="border-t bg-white">

          <div className="mx-auto max-w-7xl px-6 py-16">

            <h2 className="text-3xl font-bold text-[#0B2F24] md:text-4xl">
              Passenger Vehicle Applications
            </h2>

            <p className="mt-4 max-w-4xl text-lg leading-8 text-gray-600">
              Cars and passenger vehicles are used across South Africa
              for personal, business and commercial transport. Vehicle
              suitability depends on the individual specification,
              condition and intended application.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

              {[
                "Personal transport",
                "Business travel",
                "Company vehicles",
                "Fleet operations",
                "Staff transport",
                "Sales and service vehicles",
                "General passenger transport",
                "Business and commercial use",
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
              Cars Currently for Sale
            </h2>

            <p className="mt-4 text-lg leading-8 text-gray-600">
              View cars and passenger vehicles currently available
              through NEWTA Commercial Sales. Each listing includes
              available photographs, specifications, pricing, location
              and enquiry information.
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
                No cars currently available
              </h2>

              <p className="mt-3 text-gray-600">
                Please check back soon for new car and passenger
                vehicle listings.
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
                  Passenger Vehicles
                </h3>

                <p className="mt-3 text-gray-600">
                  Browse available cars and passenger vehicles suitable
                  for personal, business, fleet and general transport
                  applications.
                </p>

              </div>

              <div className="rounded-2xl border p-6 shadow-sm">

                <h3 className="text-xl font-bold text-[#0B2F24]">
                  View Full Details
                </h3>

                <p className="mt-3 text-gray-600">
                  Each vehicle listing includes available photographs,
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
                  available car or another commercial asset.
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
              NEWTA inventory, including trucks, buses, bakkies,
              trailers and truck tractors depending on current
              availability.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">

              <Link
                href="/equipment/trucks-for-sale-south-africa"
                className="rounded-xl bg-[#0B2F24] px-6 py-3 font-bold text-white transition hover:bg-green-900"
              >
                Trucks for Sale
              </Link>

              <Link
                href="/equipment/bakkies-for-sale-south-africa"
                className="rounded-xl bg-[#0B2F24] px-6 py-3 font-bold text-white transition hover:bg-green-900"
              >
                Bakkies for Sale
              </Link>

              <Link
                href="/equipment/buses-for-sale-south-africa"
                className="rounded-xl bg-[#0B2F24] px-6 py-3 font-bold text-white transition hover:bg-green-900"
              >
                Buses for Sale
              </Link>

              <Link
                href="/equipment/trailers-for-sale-south-africa"
                className="rounded-xl bg-[#0B2F24] px-6 py-3 font-bold text-white transition hover:bg-green-900"
              >
                Trailers for Sale
              </Link>

            </div>

          </div>

        </section>

        {/* CTA */}

        <section className="bg-[#0B2F24] text-white">

          <div className="mx-auto max-w-7xl px-6 py-16 text-center">

            <h2 className="text-3xl font-bold md:text-4xl">
              Looking for a Car?
            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-lg leading-8 text-gray-300">
              Contact NEWTA Commercial Sales if you are looking for
              a particular car or passenger vehicle, or want more
              information about an available vehicle.
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