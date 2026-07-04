import type { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "Commercial Vehicles, Machinery, Plant & Equipment for Sale | NEWTA",

  description:
    "Browse commercial vehicles, trucks, bakkies, trailers, machinery, plant equipment, industrial assets, agricultural equipment and spares available through NEWTA Commercial Sales. Private Treaty Sales across South Africa.",

  alternates: {
    canonical: "/equipment",
  },

  openGraph: {
    title:
      "Commercial Vehicles & Machinery for Sale | NEWTA Commercial Sales",

    description:
      "Browse our latest commercial vehicles, machinery, trucks, plant, trailers and industrial assets for sale across South Africa.",

    url: "https://newtacommercialsales.com/equipment",

    images: ["/og-image.png"],
  },
};
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import EquipmentCard from "../components/EquipmentCard";
import { equipment } from "../data/equipment";

export default function EquipmentPage() {
  return (
    <>
      <Navbar />

      <section className="bg-[#0B2F24] text-white py-20">
        <div className="max-w-7xl mx-auto px-6">
         <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
  Commercial Vehicles, Machinery & Equipment for Sale
</h1>

<p className="mt-5 max-w-4xl text-lg md:text-xl leading-8 text-gray-200">
  Browse commercial vehicles, trucks, bakkies, trailers,
  construction machinery, agricultural equipment, plant,
  industrial assets, mining equipment, spares and more
  available through NEWTA Commercial Sales.
  Private Treaty Sales across South Africa.
</p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">

          {equipment.map((item) => (
            <EquipmentCard
              key={item.id}
              id={item.id}
              image={item.images[0]}
              title={item.title}
              year={item.year}
              status={item.status}
              price={item.price}
              hours={item.hours}
              location={item.location}
            />
          ))}

        </div>
      </section>
      <section className="mt-20 rounded-2xl bg-gray-50 p-10">

<h2 className="text-3xl font-bold text-[#0B2F24]">
Commercial Assets Available Across South Africa
</h2>

<p className="mt-5 leading-8 text-gray-700">

NEWTA Commercial Sales specialises in the sale of commercial
vehicles, trucks, bakkies, trailers, construction equipment,
earthmoving machinery, agricultural machinery, industrial
equipment, mining equipment, generators, forklifts,
attachments, spares and business assets.

Whether you are expanding your fleet or looking for quality
used equipment, NEWTA provides transparent Private Treaty
Sales with nationwide delivery throughout South Africa.

</p>

</section>

      <Footer />
    </>
  );
}
