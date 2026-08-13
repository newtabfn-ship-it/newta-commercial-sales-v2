import type { Metadata } from "next";
import Link from "next/link";

import connectDB from "@/lib/mongodb";
import Equipment from "@/models/Equipment";
import { equipmentCategories } from "@/app/data/categories";

import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import EquipmentCard from "../../components/EquipmentCard";

export const metadata: Metadata = {
  title: "Cars for Sale South Africa | NEWTA Commercial Sales",

  description:
    "Browse cars and passenger vehicles for sale in South Africa through NEWTA Commercial Sales. View available vehicles, specifications, images, pricing and enquiry information.",

  alternates: {
    canonical:
      "https://newtacommercialsales.com/equipment/cars-for-sale-south-africa",
  },

  openGraph: {
    title: "Cars for Sale South Africa | NEWTA Commercial Sales",

    description:
      "Browse cars and passenger vehicles currently available through NEWTA Commercial Sales across South Africa.",

    url:
      "https://newtacommercialsales.com/equipment/cars-for-sale-south-africa",

    type: "website",
    siteName: "NEWTA Commercial Sales",
    locale: "en_ZA",
  },

  twitter: {
    card: "summary_large_image",

    title: "Cars for Sale South Africa | NEWTA Commercial Sales",

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
    "@type": "CollectionPage",

    name: "Cars for Sale South Africa",

    description:
      "Cars and passenger vehicles for sale through NEWTA Commercial Sales.",

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
        <section className="bg-gradient-to-r from-green-950 via-green-900 to-green-800 text-white">
          <div className="mx-auto max-w-7xl px-6 py-20">
            <nav
              aria-label="Breadcrumb"
              className="mb-8 text-sm text-gray-300"
            >
              <Link href="/" className="hover:text-[#D4AF37]">
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
              Browse cars and passenger vehicles currently available
              through NEWTA Commercial Sales. View photographs,
              specifications, pricing and enquiry information for
              available vehicles across South Africa.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-16">
          <div className="max-w-4xl">
            <h2 className="text-3xl font-bold text-[#0B2F24] md:text-4xl">
              Cars & Passenger Vehicles for Sale
            </h2>

            <p className="mt-5 text-lg leading-8 text-gray-600">
              NEWTA Commercial Sales connects buyers with vehicles
              and commercial assets available through Private Treaty
              Sales. Browse our current passenger vehicle listings
              below.
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
                      ? item.images.find((img: any) => img.cover)?.url ??
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
                Please check back soon for new passenger vehicle
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

        <section className="border-t bg-white">
          <div className="mx-auto max-w-7xl px-6 py-16">
            <h2 className="text-3xl font-bold text-[#0B2F24]">
              Passenger Vehicles Available
            </h2>

            <p className="mt-5 max-w-4xl text-lg leading-8 text-gray-600">
              Browse available cars and passenger vehicles listed by
              NEWTA Commercial Sales. Each listing provides the
              available vehicle details, photographs and enquiry
              information.
            </p>
          </div>
        </section>

        <section className="bg-[#0B2F24] text-white">
          <div className="mx-auto max-w-7xl px-6 py-16 text-center">
            <h2 className="text-3xl font-bold md:text-4xl">
              Looking for a Specific Car?
            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-300">
              Contact NEWTA Commercial Sales if you are looking for
              a particular vehicle or want more information about an
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