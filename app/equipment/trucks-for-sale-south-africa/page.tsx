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
  "Trucks for Sale South Africa | Commercial Trucks | NEWTA",

  description:
  "Browse trucks for sale in South Africa through NEWTA Commercial Sales. Find dropside trucks, flatdeck trucks, 2 ton, 3 ton, 4 ton, 8 ton, 10 ton, 12 ton, 14 ton and 16 ton trucks, plus other commercial trucks.",

  alternates: {
    canonical:
      "https://newtacommercialsales.com/equipment/trucks-for-sale-south-africa",
  },

  openGraph: {
    title:
      "Trucks for Sale South Africa | NEWTA Commercial Sales",

    description:
  "Browse commercial trucks for sale across South Africa through NEWTA Commercial Sales, including dropside trucks, flatdeck trucks, rigid trucks, truck tractors and trucks in various tonnage classes.",

    url:
      "https://newtacommercialsales.com/equipment/trucks-for-sale-south-africa",

    type: "website",

    siteName: "NEWTA Commercial Sales",

    locale: "en_ZA",
  },

  twitter: {
    card: "summary_large_image",

    title:
      "Trucks for Sale South Africa | NEWTA Commercial Sales",

    description:
  "Browse trucks for sale in South Africa, including dropside trucks, flatdeck trucks, rigid trucks, truck tractors and other commercial vehicles from NEWTA Commercial Sales.",
  },
};

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
  category: "Commercial Vehicles",
  subcategory: { $in: truckSubcategories },
  status: "Available",
})
  .sort({ createdAt: -1 })
  .lean();

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",

    name: "Trucks for Sale South Africa",

    description:
  "Commercial trucks for sale in South Africa through NEWTA Commercial Sales, including dropside trucks, flatdeck trucks, rigid trucks, truck tractors, mixer trucks, crane trucks and other commercial vehicles.",
    url:
      "https://newtacommercialsales.com/equipment/trucks-for-sale-south-africa",

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
                Trucks for Sale South Africa
              </span>
            </nav>

            <span className="inline-block rounded-full bg-[#D4AF37] px-5 py-2 text-sm font-bold uppercase tracking-wider text-[#0B2F24]">
              Private Treaty Sales
            </span>

            <h1 className="mt-6 max-w-4xl text-4xl font-extrabold leading-tight md:text-6xl">
              Trucks for Sale South Africa
            </h1>

            <p className="mt-6 max-w-4xl text-lg leading-8 text-gray-200 md:text-xl">
              Browse commercial trucks for sale across South Africa through
NEWTA Commercial Sales. Our truck inventory can include dropside
trucks, flatdeck trucks, rigid trucks, truck tractors, mixer trucks,
crane trucks and other commercial vehicles in a range of sizes and
tonnage classes.
            </p>

          </div>

        </section>

        {/* CONTENT */}

        <section className="mx-auto max-w-7xl px-6 py-16">

          <div className="max-w-4xl">

            <h2 className="text-3xl font-bold text-[#0B2F24] md:text-4xl">
              Commercial Trucks for Sale
            </h2>

            <p className="mt-5 text-lg leading-8 text-gray-600">
              NEWTA Commercial Sales connects buyers with commercial
vehicles and equipment available from sellers across
South Africa. Our truck inventory covers a wide range of
commercial vehicles, from smaller 2 ton, 3 ton and 4 ton
trucks through to larger 8 ton, 10 ton, 12 ton, 14 ton
and 16 ton trucks.

Depending on current availability, buyers can find
dropside trucks, flatdeck trucks, rigid trucks, delivery
trucks, truck tractors, mixer trucks, crane trucks and
other commercial trucks for sale through Private Treaty
Sales.

Browse the current truck listings below for specifications,
photographs, pricing, location and enquiry information.
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

        {/* TRUCK TYPES */}

<section className="border-t bg-white">

  <div className="mx-auto max-w-7xl px-6 py-16">

    <h2 className="text-3xl font-bold text-[#0B2F24]">
      Commercial Truck Types for Sale
    </h2>

    <p className="mt-4 max-w-4xl text-lg leading-8 text-gray-600">
      NEWTA Commercial Sales offers a broad range of commercial
      trucks for sale in South Africa. Available truck types and
      specifications vary according to current stock and seller
      requirements.
    </p>

    <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">

      <div className="rounded-2xl border p-6 shadow-sm">
        <h3 className="text-xl font-bold text-[#0B2F24]">
          Dropside Trucks
        </h3>
        <p className="mt-3 text-gray-600">
          Commercial dropside trucks for transport, deliveries,
          construction and general business use.
        </p>
      </div>

      <div className="rounded-2xl border p-6 shadow-sm">
        <h3 className="text-xl font-bold text-[#0B2F24]">
          Flatdeck Trucks
        </h3>
        <p className="mt-3 text-gray-600">
          Flatdeck and platform trucks suitable for transporting
          machinery, equipment, materials and general cargo.
        </p>
      </div>

      <div className="rounded-2xl border p-6 shadow-sm">
        <h3 className="text-xl font-bold text-[#0B2F24]">
          2 Ton, 3 Ton and 4 Ton Trucks
        </h3>
        <p className="mt-3 text-gray-600">
          Smaller commercial trucks suitable for deliveries,
          transport businesses and general commercial applications.
        </p>
      </div>

      <div className="rounded-2xl border p-6 shadow-sm">
        <h3 className="text-xl font-bold text-[#0B2F24]">
          8 Ton, 10 Ton and 12 Ton Trucks
        </h3>
        <p className="mt-3 text-gray-600">
          Medium and heavy commercial trucks available according
          to current NEWTA inventory.
        </p>
      </div>

      <div className="rounded-2xl border p-6 shadow-sm">
        <h3 className="text-xl font-bold text-[#0B2F24]">
          14 Ton and 16 Ton Trucks
        </h3>
        <p className="mt-3 text-gray-600">
          Larger commercial trucks for transport, construction,
          industrial and heavy-duty applications.
        </p>
      </div>

      <div className="rounded-2xl border p-6 shadow-sm">
        <h3 className="text-xl font-bold text-[#0B2F24]">
          Specialised Commercial Trucks
        </h3>
        <p className="mt-3 text-gray-600">
          Mixer trucks, crane trucks, truck tractors and other
          specialised commercial vehicles available through
          Private Treaty Sales.
        </p>
      </div>

    </div>

  </div>

</section>
        {/* CTA */}

        <section className="bg-[#0B2F24] text-white">

          <div className="mx-auto max-w-7xl px-6 py-16 text-center">

            <h2 className="text-3xl font-bold md:text-4xl">
              Looking for a Specific Truck?
            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-300">
              Contact NEWTA Commercial Sales if you are looking for
              a particular commercial vehicle or want more information
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