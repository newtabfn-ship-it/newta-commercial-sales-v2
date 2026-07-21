import Link from "next/link";

import EquipmentGallery from "../../components/EquipmentGallery";
import EquipmentDescription from "../../components/EquipmentDescription";
import EquipmentSpecifications from "../../components/EquipmentSpecifications";
import EquipmentSummary from "../../components/EquipmentSummary";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

import connectDB from "@/lib/mongodb";
import Equipment from "@/models/Equipment";

import { generateEquipmentMetadata } from "./metadata";
import { generateStructuredData } from "./structuredData";
import EnquiryButton from "../../components/EnquiryButton";

import MobileActionBar from "../../components/MobileActionBar";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return generateEquipmentMetadata(id);
}



export default async function EquipmentDetails({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

 await connectDB();

const item = await Equipment.findById(id).lean();
  if (!item) {
    return (
      <>
        <Navbar />

        <div className="max-w-7xl mx-auto px-6 py-10">
          <h1 className="text-4xl font-bold text-[#0B2F24]">
            Listing Not Found
          </h1>

          <p className="mt-4 text-lg text-gray-600">
            The commercial vehicle, machinery or asset you are looking
            for may have been sold or removed.
          </p>

          <Link
            href="/equipment"
            className="mt-8 inline-block rounded-xl bg-[#D4AF37] px-6 py-3 font-bold text-[#0B2F24]"
          >
            Back to Listings
          </Link>
        </div>

        <Footer />
      </>
    );
  }

  const structuredData = generateStructuredData(id);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />

      <Navbar />

     {/* Hero */}
<section className="bg-[#0B2F24] text-white pt-52 pb-20">
  <div className="max-w-7xl mx-auto px-6">

    <span className="inline-block rounded-full bg-[#D4AF37] px-5 py-2 text-sm font-bold uppercase tracking-wider text-[#0B2F24]">
      Private Treaty Sales
    </span>

    <span
  className={`inline-flex items-center rounded-full px-5 py-2 text-sm font-bold uppercase tracking-wider shadow-lg ${
    item.status === "Available"
      ? "bg-green-600 text-white"
      : "bg-red-600 text-white"
  }`}
>
  {item.status}
</span>

    <h1 className="mt-8 text-4xl md:text-5xl font-extrabold leading-tight">
  {item.title}
</h1>
<p className="mt-4 text-xl text-gray-300">
  {item.referenceNumber}
</p>

{/* PRICE */}
<h2 className="mt-6 text-5xl font-black text-[#D4AF37]">
  {item.currency} {item.price}
</h2>

<div className="mt-8 flex flex-wrap gap-4">

  <div className="rounded-xl bg-white/10 px-5 py-4 backdrop-blur-md">
    <p className="text-xs uppercase tracking-wider text-gray-300">
      Year
    </p>
    <p className="mt-1 text-xl font-bold">
      {item.year}
    </p>
  </div>

  <div className="rounded-xl bg-white/10 px-5 py-4 backdrop-blur-md">
    <p className="text-xs uppercase tracking-wider text-gray-300">
      Hours
    </p>
    <p className="mt-1 text-xl font-bold">
      {item.kmHours}
    </p>
  </div>

  <div className="rounded-xl bg-white/10 px-5 py-4 backdrop-blur-md">
    <p className="text-xs uppercase tracking-wider text-gray-300">
      Manufacturer
    </p>
    <p className="mt-1 text-xl font-bold">
      {item.manufacturer}
    </p>
  </div>

  <div className="rounded-xl bg-white/10 px-5 py-4 backdrop-blur-md">
    <p className="text-xs uppercase tracking-wider text-gray-300">
      Location
    </p>
    <p className="mt-1 text-xl font-bold">
      {item.province}
    </p>
  </div>

</div>

    <p className="mt-6 max-w-4xl text-lg md:text-xl leading-8 text-gray-300">
      Browse commercial vehicles, trucks, bakkies, trailers,
      construction machinery, agricultural equipment, plant,
      industrial assets, mining equipment, spares and more
      available through NEWTA Commercial Sales.
      Private Treaty Sales across South Africa.
    </p>

  </div>
</section>
      {/* Main Content */}
      <section className="max-w-7xl mx-auto px-6 py-20">

        <div className="grid lg:grid-cols-3 gap-12">

          {/* LEFT COLUMN */}
          <div className="lg:col-span-2">

            <EquipmentGallery
  images={item.images.map((image: any) => ({
    url: image.url,
    cover: image.cover,
  }))}
  title={item.title}
/>

            <EquipmentDescription
              description={item.description}
            />

            <EquipmentSpecifications
              manufacturer={item.manufacturer}
              model={item.model}
              year={item.year}
              hours={item.kmHours}
              engine={item.specifications?.engine}
              power=""
              operatingWeight=""
              bucket={item.specifications?.capacityBucket}
              fuel={item.specifications?.fuelType}
              drive={item.specifications?.transmission}
              serialNumber={item.serialNumber}
/>

          </div>

                  {/* RIGHT COLUMN */}
          <div className="lg:sticky lg:top-36 self-start">

            <EquipmentSummary
              equipmentId={item._id.toString()}
              status={item.status}
              price={`${item.currency} ${item.price}`}
              hours={item.kmHours}
              year={item.year}
              manufacturer={item.manufacturer}
              location={item.province}
            />

            <div className="mt-8 rounded-2xl border bg-[#FAF8F2] p-6 shadow">
              <h3 className="text-2xl font-bold text-[#0B2F24]">
                Interested in this asset?
              </h3>

              <p className="mt-3 text-gray-600">
                Contact NEWTA Commercial Sales for pricing,
                availability and further information.
              </p>

              <EnquiryButton
                equipmentId={item._id.toString()}
                equipmentTitle={item.title}
              />
            </div>

          </div> {/* End RIGHT COLUMN */}

        </div> {/* End GRID */}

     </section>

<MobileActionBar
  equipmentId={item._id.toString()}
/>

<Footer />
    </>
  );
}