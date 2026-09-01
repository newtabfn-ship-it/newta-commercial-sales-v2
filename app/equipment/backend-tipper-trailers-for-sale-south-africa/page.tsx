import type { Metadata } from "next";
import Link from "next/link";

import connectDB from "@/lib/mongodb";
import Equipment from "@/models/Equipment";
import { equipmentCategories } from "@/app/data/categories";

import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import EquipmentCard from "../../components/EquipmentCard";

const pageUrl =
  "https://newtacommercialsales.com/equipment/backend-tipper-trailers-for-sale-south-africa";

export const metadata: Metadata = {
  title:
    "Backend Tipper Trailers for Sale South Africa | NEWTA Commercial Sales",

  description:
    "Backend tipper trailers for sale in South Africa through NEWTA Commercial Sales. Browse available rear tipping trailers, including Sloper and Copelyn trailers, with specifications, photographs, pricing and enquiry information.",

  alternates: {
    canonical: pageUrl,
  },

  openGraph: {
    title:
      "Backend Tipper Trailers for Sale South Africa | NEWTA Commercial Sales",

    description:
      "Browse backend tipper trailers for sale through NEWTA Commercial Sales, including Sloper, Copelyn and other rear tipping trailers available across South Africa.",

    url: pageUrl,

    type: "website",

    siteName: "NEWTA Commercial Sales",

    locale: "en_ZA",
  },

  twitter: {
    card: "summary_large_image",

    title:
      "Backend Tipper Trailers for Sale South Africa | NEWTA Commercial Sales",

    description:
      "Browse available backend tipper trailers through NEWTA Commercial Sales.",
  },
};

export default async function BackendTipperTrailersForSalePage() {
  await connectDB();

  const commercialVehicles = equipmentCategories.find(
    (category) => category.slug === "commercial-vehicles"
  );

  const trailers = commercialVehicles?.subcategories.find(
    (subcategory) => subcategory.slug === "trailers"
  );

  /*
   * Backend Tipper trailers currently use the main Trailers category.
   *
   * Until Backend Tipper trailers have their own dedicated category,
   * we retrieve available trailer listings and identify relevant
   * listings from their title, description, make, model and type.
   */

  const trailerEquipment = await Equipment.find({
    category: commercialVehicles?.name,
    subcategory: trailers?.name,
    status: "Available",
  })
    .sort({ createdAt: -1 })
    .lean();

  const backendTipperEquipment = trailerEquipment.filter((item: any) => {
    const searchableText = [
      item.title,
      item.description,
      item.make,
      item.model,
      item.type,
      item.subcategory,
      item.category,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    return (
      searchableText.includes("backend tipper") ||
      searchableText.includes("back end tipper") ||
      searchableText.includes("back-end tipper") ||
      searchableText.includes("rear tipper") ||
      searchableText.includes("rear tipping") ||
      searchableText.includes("sloper") ||
      searchableText.includes("copelyn")
    );
  });

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",

    name: "Backend Tipper Trailers for Sale South Africa",

    description:
      "Backend tipper trailers for sale through NEWTA Commercial Sales.",

    url: pageUrl,

    isPartOf: {
      "@type": "WebSite",
      name: "NEWTA Commercial Sales",
      url: "https://newtacommercialsales.com",
    },

    about: {
      "@type": "Thing",
      name: "Backend Tipper Trailers",
    },

    mainEntity: {
      "@type": "ItemList",

      numberOfItems: backendTipperEquipment.length,

      itemListElement: backendTipperEquipment.map(
        (item: any, index: number) => ({
          "@type": "ListItem",

          position: index + 1,

          name: item.title,

          url: `https://newtacommercialsales.com/equipment/${item.slug}`,
        })
      ),
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
                className="transition hover:text-[#D4AF37]"
              >
                Home
              </Link>

              <span className="mx-2">/</span>

              <Link
                href="/equipment"
                className="transition hover:text-[#D4AF37]"
              >
                Equipment
              </Link>

              <span className="mx-2">/</span>

              <Link
                href="/equipment/trailers-for-sale-south-africa"
                className="transition hover:text-[#D4AF37]"
              >
                Trailers for Sale
              </Link>

              <span className="mx-2">/</span>

              <span className="text-[#D4AF37]">
                Backend Tipper Trailers
              </span>

            </nav>

            <span className="inline-block rounded-full bg-[#D4AF37] px-5 py-2 text-sm font-bold uppercase tracking-wider text-[#0B2F24]">
              Private Treaty Sales
            </span>

            <h1 className="mt-6 max-w-5xl text-4xl font-extrabold leading-tight md:text-6xl">
              Backend Tipper Trailers for Sale South Africa
            </h1>

            <p className="mt-6 max-w-4xl text-lg leading-8 text-gray-200 md:text-xl">
              Browse backend tipper trailers for sale in South Africa
              through NEWTA Commercial Sales. Find rear tipping trailers
              suitable for transporting and unloading sand, stone,
              aggregate, agricultural materials and other bulk loads.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">

              <Link
                href="#available-trailers"
                className="rounded-xl bg-[#D4AF37] px-7 py-3 font-bold text-[#0B2F24] shadow-lg transition hover:bg-[#C89B2C]"
              >
                View Available Trailers
              </Link>

              <Link
                href="/contact"
                className="rounded-xl border border-white/30 bg-white/10 px-7 py-3 font-bold text-white transition hover:bg-white/20"
              >
                Enquire About a Trailer
              </Link>

            </div>

          </div>

        </section>

        {/* INTRODUCTION */}

        <section className="mx-auto max-w-7xl px-6 py-16">

          <div className="max-w-4xl">

            <h2 className="text-3xl font-bold text-[#0B2F24] md:text-4xl">
              Backend Tipper Trailers for Sale
            </h2>

            <p className="mt-5 text-lg leading-8 text-gray-600">
              Backend tipper trailers are designed to transport and
              discharge bulk materials from the rear of the trailer.
              They are commonly used in construction, agriculture,
              quarrying, aggregate transport and general commercial
              haulage.
            </p>

            <p className="mt-5 text-lg leading-8 text-gray-600">
              NEWTA Commercial Sales lists available trailers through
              Private Treaty Sales. Individual listings provide the
              available photographs, specifications, dimensions,
              capacity, pricing, location and enquiry information for
              each trailer.
            </p>

            <p className="mt-5 text-lg leading-8 text-gray-600">
              Backend tipping trailers can be available in different
              sizes, configurations and cubic metre capacities. Buyers
              should refer to the individual NEWTA listing for the exact
              specification of each trailer.
            </p>

          </div>

        </section>

        {/* COMMON USES */}

        <section className="border-y bg-white">

          <div className="mx-auto max-w-7xl px-6 py-16">

            <div className="max-w-4xl">

              <h2 className="text-3xl font-bold text-[#0B2F24] md:text-4xl">
                Common Uses for Backend Tipper Trailers
              </h2>

              <p className="mt-5 text-lg leading-8 text-gray-600">
                Backend tipper trailers can be used for a wide range
                of commercial bulk transport applications.
              </p>

            </div>

            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">

              {[
                "Sand transport",
                "Stone and aggregate",
                "Construction materials",
                "Agricultural materials",
                "Bulk material transport",
                "Quarrying applications",
                "General commercial haulage",
                "Material handling",
                "Earthmoving support",
              ].map((use) => (

                <div
                  key={use}
                  className="rounded-2xl border bg-[#FAF8F2] p-6 shadow-sm"
                >

                  <div className="flex items-start gap-3">

                    <span className="mt-1 text-lg font-bold text-[#D4AF37]">
                      ✓
                    </span>

                    <span className="font-semibold text-[#0B2F24]">
                      {use}
                    </span>

                  </div>

                </div>

              ))}

            </div>

          </div>

        </section>

        {/* SLOPER AND COPELYN */}

        <section className="bg-[#FAF8F2]">

          <div className="mx-auto max-w-7xl px-6 py-16">

            <div className="max-w-4xl">

              <h2 className="text-3xl font-bold text-[#0B2F24] md:text-4xl">
                Sloper and Copelyn Backend Tipper Trailers
              </h2>

              <p className="mt-5 text-lg leading-8 text-gray-600">
                NEWTA Commercial Sales may list different makes and
                types of backend tipping trailers. Sloper and Copelyn
                are examples of trailer names that may be associated
                with backend tipping equipment.
              </p>

              <p className="mt-5 text-lg leading-8 text-gray-600">
                The exact trailer design, dimensions, cubic metre
                capacity, condition and specification can differ from
                one asset to another. Always refer to the individual
                listing for the specific trailer information.
              </p>

            </div>

            <div className="mt-10 grid gap-6 md:grid-cols-2">

              <div className="rounded-2xl border bg-white p-7 shadow-sm">

                <h3 className="text-2xl font-bold text-[#0B2F24]">
                  Sloper Tipper Trailers
                </h3>

                <p className="mt-4 leading-7 text-gray-600">
                  Sloper trailers are used for bulk material transport
                  and rear discharge applications. Available trailer
                  specifications depend on the individual asset listed
                  by NEWTA Commercial Sales.
                </p>

              </div>

              <div className="rounded-2xl border bg-white p-7 shadow-sm">

                <h3 className="text-2xl font-bold text-[#0B2F24]">
                  Copelyn Tipper Trailers
                </h3>

                <p className="mt-4 leading-7 text-gray-600">
                  Copelyn trailers can be used for transporting and
                  unloading bulk materials. The individual trailer
                  listing determines its exact configuration,
                  dimensions and capacity.
                </p>

              </div>

            </div>

          </div>

        </section>

        {/* AVAILABLE LISTINGS */}

        <section
          id="available-trailers"
          className="mx-auto max-w-7xl px-6 py-16"
        >

          <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">

            <div className="max-w-4xl">

              <h2 className="text-3xl font-bold text-[#0B2F24] md:text-4xl">
                Backend Tipper Trailers Currently Available
              </h2>

              <p className="mt-5 text-lg leading-8 text-gray-600">
                Browse current backend tipper trailer listings from
                NEWTA Commercial Sales. Open an individual listing to
                view available photographs, specifications, pricing,
                location and enquiry information.
              </p>

            </div>

            <div className="shrink-0 rounded-xl bg-white px-5 py-3 text-sm font-bold text-[#0B2F24] shadow-sm ring-1 ring-gray-200">
              {backendTipperEquipment.length}{" "}
              {backendTipperEquipment.length === 1
                ? "Available Trailer"
                : "Available Trailers"}
            </div>

          </div>

          {backendTipperEquipment.length > 0 ? (

            <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">

              {backendTipperEquipment.map((item: any) => (

                <EquipmentCard
                  key={item._id.toString()}
                  id={item.slug}
                  slug={item.slug}
                  image={
                    item.images?.length
                      ? item.images.find(
                          (img: any) => img.cover
                        )?.url ?? item.images[0].url
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
                No Backend Tipper Trailers Currently Available
              </h2>

              <p className="mx-auto mt-3 max-w-2xl leading-7 text-gray-600">
                There are currently no backend tipper trailers listed
                as available. New trailers may be added as they become
                available through NEWTA Commercial Sales.
              </p>

              <div className="mt-6 flex flex-wrap justify-center gap-4">

                <Link
                  href="/equipment/trailers-for-sale-south-africa"
                  className="rounded-xl bg-[#D4AF37] px-6 py-3 font-bold text-[#0B2F24] transition hover:bg-[#C89B2C]"
                >
                  View All Trailers
                </Link>

                <Link
                  href="/contact"
                  className="rounded-xl bg-[#0B2F24] px-6 py-3 font-bold text-white transition hover:bg-green-900"
                >
                  Contact NEWTA
                </Link>

              </div>

            </div>

          )}

        </section>

        {/* TRAILER BUYER INFORMATION */}

        <section className="border-y bg-white">

          <div className="mx-auto max-w-7xl px-6 py-16">

            <div className="max-w-4xl">

              <h2 className="text-3xl font-bold text-[#0B2F24] md:text-4xl">
                Buying a Backend Tipper Trailer
              </h2>

              <p className="mt-5 text-lg leading-8 text-gray-600">
                When considering a backend tipper trailer, buyers
                should review the individual trailer's available
                specifications and condition. Important information
                can include trailer dimensions, cubic metre capacity,
                construction, tipping configuration and overall
                condition.
              </p>

            </div>

            <div className="mt-10 grid gap-6 md:grid-cols-3">

              <div className="rounded-2xl border bg-[#FAF8F2] p-7 shadow-sm">

                <div className="text-3xl font-extrabold text-[#D4AF37]">
                  01
                </div>

                <h3 className="mt-4 text-xl font-bold text-[#0B2F24]">
                  Check the Specification
                </h3>

                <p className="mt-3 leading-7 text-gray-600">
                  Review the available dimensions, capacity,
                  configuration and other specifications supplied
                  with the listing.
                </p>

              </div>

              <div className="rounded-2xl border bg-[#FAF8F2] p-7 shadow-sm">

                <div className="text-3xl font-extrabold text-[#D4AF37]">
                  02
                </div>

                <h3 className="mt-4 text-xl font-bold text-[#0B2F24]">
                  Review the Photos
                </h3>

                <p className="mt-3 leading-7 text-gray-600">
                  Examine the available photographs and listing
                  information to understand the condition and
                  configuration of the trailer.
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
                  Contact NEWTA Commercial Sales for additional
                  information about an available backend tipper
                  trailer.
                </p>

              </div>

            </div>

          </div>

        </section>

        {/* RELATED TRAILERS */}

        <section className="bg-[#FAF8F2]">

          <div className="mx-auto max-w-7xl px-6 py-16">

            <div className="max-w-4xl">

              <h2 className="text-3xl font-bold text-[#0B2F24] md:text-4xl">
                Other Trailers for Sale in South Africa
              </h2>

              <p className="mt-5 text-lg leading-8 text-gray-600">
                Looking for a different trailer? Browse the wider
                NEWTA Commercial Sales trailer inventory and related
                trailer categories.
              </p>

            </div>

            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

              <Link
                href="/equipment/trailers-for-sale-south-africa"
                className="rounded-2xl border bg-white p-6 font-bold text-[#0B2F24] shadow-sm transition hover:-translate-y-1 hover:border-[#D4AF37] hover:shadow-md"
              >
                All Trailers →
              </Link>

              <Link
                href="/equipment/side-tipper-trailers-for-sale-south-africa"
                className="rounded-2xl border bg-white p-6 font-bold text-[#0B2F24] shadow-sm transition hover:-translate-y-1 hover:border-[#D4AF37] hover:shadow-md"
              >
                Side Tipper Trailers →
              </Link>

              <Link
                href="/equipment/dropside-trailers-for-sale-south-africa"
                className="rounded-2xl border bg-white p-6 font-bold text-[#0B2F24] shadow-sm transition hover:-translate-y-1 hover:border-[#D4AF37] hover:shadow-md"
              >
                Dropside Trailers →
              </Link>

              <Link
                href="/equipment"
                className="rounded-2xl border bg-white p-6 font-bold text-[#0B2F24] shadow-sm transition hover:-translate-y-1 hover:border-[#D4AF37] hover:shadow-md"
              >
                All Equipment →
              </Link>

            </div>

          </div>

        </section>

        {/* FINAL CTA */}

        <section className="bg-[#0B2F24] text-white">

          <div className="mx-auto max-w-7xl px-6 py-16 text-center">

            <span className="inline-block rounded-full bg-[#D4AF37] px-5 py-2 text-sm font-bold uppercase tracking-wider text-[#0B2F24]">
              NEWTA Commercial Sales
            </span>

            <h2 className="mt-6 text-3xl font-bold md:text-4xl">
              Looking for a Backend Tipper Trailer?
            </h2>

            <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-gray-300">
              Contact NEWTA Commercial Sales if you are looking for
              a specific backend tipper trailer, Sloper trailer,
              Copelyn trailer or another commercial trailer.
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