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

import connectDB from "@/lib/mongodb";
import Equipment from "@/models/Equipment";

import EnquiryButton from "../../components/EnquiryButton";

export default async function EquipmentPage() {
  await connectDB();

  console.log("Connected to MongoDB");

  const count = await Equipment.countDocuments();
  console.log("Equipment count:", count);

  const equipment = await Equipment.find()
    .sort({ createdAt: -1 })
    .lean();
    console.log("Equipment loaded:", equipment.length);

  console.log("Equipment loaded");

  return (
    <>
      <Navbar />

      <section className="bg-[#0B2F24] text-white pt-44 pb-20">
        <div className="max-w-7xl mx-auto px-6">
          <span className="inline-block rounded-full bg-[#D4AF37] px-5 py-2 text-sm font-bold uppercase tracking-wider text-[#0B2F24]">
            Private Treaty Sales
          </span>

          <h1 className="mt-8 text-4xl md:text-5xl font-extrabold leading-tight">
            Commercial Vehicles, Machinery & Equipment for Sale
          </h1>

          <p className="mt-6 max-w-4xl text-lg md:text-xl leading-8 text-gray-300">
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
          {equipment.map((item: any) => (
            <EquipmentCard
              key={item._id.toString()}
              id={item._id.toString()}
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
      </section>

      <section className="mt-20 rounded-2xl bg-gray-50 p-10 max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-[#0B2F24]">
          Commercial Assets Available Across South Africa
        </h2>

        <p className="mt-5 leading-8 text-gray-700">
          NEWTA Commercial Sales specialises in the sale of commercial
          vehicles, trucks, bakkies, trailers, construction equipment,
          earthmoving machinery, agricultural machinery, industrial
          equipment, mining equipment, generators, forklifts,
          attachments, spares and business assets.
          <br />
          <br />
          Whether you are expanding your fleet or looking for quality
          used equipment, NEWTA provides transparent Private Treaty
          Sales with nationwide delivery throughout South Africa.
        </p>
      </section>

      <Footer />
    </>
  );
}