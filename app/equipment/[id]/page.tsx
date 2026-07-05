import Link from "next/link";

import EquipmentGallery from "../../components/EquipmentGallery";
import EquipmentDescription from "../../components/EquipmentDescription";
import EquipmentSpecifications from "../../components/EquipmentSpecifications";
import EquipmentSummary from "../../components/EquipmentSummary";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

import { equipment } from "../../data/equipment";

import { generateEquipmentMetadata } from "./metadata";
import { generateStructuredData } from "./structuredData";

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

  const item = equipment.find((eq) => eq.id === id);

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

    <span className="inline-flex items-center rounded-full bg-[#D4AF37] px-5 py-2 text-sm font-bold uppercase tracking-wider text-[#0B2F24] shadow-lg">
  AVAILABLE
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
      {/* Main Content */}
      <section className="max-w-7xl mx-auto px-6 py-16">

        <div className="grid lg:grid-cols-3 gap-12">

          {/* LEFT COLUMN */}
          <div className="lg:col-span-2">

            <EquipmentGallery
              images={item.images}
              title={item.title}
            />

            <EquipmentDescription
              description={item.description}
            />

            <EquipmentSpecifications
              manufacturer={item.manufacturer}
              model={item.model}
              year={item.year}
              hours={item.hours}
              engine={item.engine}
              power={item.power}
              operatingWeight={item.operatingWeight}
              bucket={item.bucket}
              fuel={item.fuel}
              drive={item.drive}
              serialNumber={item.serialNumber}
            />

          </div>

          {/* RIGHT COLUMN */}
          <div>

            <EquipmentSummary
              status={item.status}
              price={item.price}
              hours={item.hours}
              year={item.year}
              manufacturer={item.manufacturer}
              location={item.location}
            />

          </div>

        </div>

      </section>

      <Footer />
    </>
  );
}