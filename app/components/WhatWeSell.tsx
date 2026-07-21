import Link from "next/link";

const categories = [
  {
    icon: "🚛",
    title: "Commercial Vehicles",
    description:
      "Trucks, bakkies, trailers, fleet vehicles and commercial transport solutions.",
  },
  {
    icon: "🏗️",
    title: "Machinery & Plant",
    description:
      "Construction, earthmoving, mining and industrial machinery for every industry.",
  },
  {
    icon: "🌾",
    title: "Agricultural Equipment",
    description:
      "Tractors, implements, farming machinery and agricultural assets.",
  },
  {
    icon: "🏭",
    title: "Industrial Assets",
    description:
      "Generators, forklifts, compressors, workshop equipment, spares and more.",
  },
];

export default function WhatWeSell() {
  return (
    <section className="bg-[#F8F8F5] py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-6">

        {/* Heading */}
        <div className="mx-auto mb-16 max-w-3xl text-center">

          <p className="text-sm font-bold uppercase tracking-[6px] text-[#D4AF37]">
            What We Sell
          </p>

          <h2 className="mt-4 text-3xl font-black text-[#0B2F24] md:text-5xl">
            Commercial Assets
            <br />
            Across South Africa
          </h2>

          <p className="mt-6 text-base leading-8 text-gray-600 md:text-lg">
            NEWTA Commercial Sales specialises in the marketing and sale of
            commercial vehicles, machinery, plant equipment, agricultural
            equipment and industrial assets through professional Private
            Treaty Sales.
          </p>

        </div>

        {/* Categories */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">

          {categories.map((category) => (
            <div
              key={category.title}
              className="rounded-3xl border border-gray-200 bg-white p-8 shadow-lg transition-all duration-300 hover:-translate-y-2 hover:border-[#D4AF37] hover:shadow-2xl"
            >
              <div className="text-5xl">{category.icon}</div>

              <h3 className="mt-6 text-2xl font-bold text-[#0B2F24]">
                {category.title}
              </h3>

              <p className="mt-4 leading-7 text-gray-600">
                {category.description}
              </p>
            </div>
          ))}

        </div>

        {/* CTA */}
        <div className="mt-16 text-center">

          <Link
            href="/equipment"
            className="inline-flex items-center rounded-xl bg-[#D4AF37] px-8 py-4 text-lg font-bold text-[#0B2F24] shadow-lg transition hover:bg-[#C89B2C]"
          >
            Browse Current Listings →
          </Link>

        </div>

      </div>
    </section>
  );
}