import type { Metadata } from "next";
import Link from "next/link";
import connectDB from "@/lib/mongodb";
import Equipment from "@/models/Equipment";
import { equipmentCategories } from "@/app/data/categories";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import EquipmentCard from "@/app/components/EquipmentCard";

export const dynamic = "force-dynamic";
const title = "Engineering & Workshop Machinery for Sale South Africa";
const url = "https://newtacommercialsales.com/equipment/engineering-workshop-machinery-for-sale-south-africa";
const description = "Browse used lathes, milling machines, engineering machinery and workshop equipment for sale in South Africa through NEWTA Commercial Sales.";

export const metadata: Metadata = {
  title, description,
  alternates: { canonical: url },
  openGraph: { title, description, url, type: "website", siteName: "NEWTA Commercial Sales", locale: "en_ZA" },
  twitter: { card: "summary_large_image", title, description },
};

const machineryTypes = [
  "Lathes", "Milling machines", "Surface grinders", "Radial drilling machines",
  "Boring machines", "Hydraulic presses", "Guillotines", "Press brakes",
  "Metal cutting bandsaws", "CNC machines", "Shaping machines", "Welding equipment",
  "Starter and alternator test benches", "Other engineering and workshop machinery",
];

export default async function EngineeringWorkshopMachineryPage() {
  const category = equipmentCategories.find(value => value.slug === "plant-machinery");
  const subcategory = category?.subcategories.find(value => value.slug === "engineering-workshop-machinery");
  if (!category || !subcategory) throw new Error("Engineering machinery category is not configured.");
  await connectDB();
  const equipment = await Equipment.find({
    category: category.name, subcategory: subcategory.name, status: "Available",
  }).sort({ createdAt: -1 }).lean();
  const structuredData = {
    "@context": "https://schema.org", "@type": "CollectionPage", name: title, description, url,
    isPartOf: { "@type": "WebSite", name: "NEWTA Commercial Sales", url: "https://newtacommercialsales.com" },
    mainEntity: { "@type": "ItemList", numberOfItems: equipment.length,
      itemListElement: equipment.map((item, index) => ({ "@type": "ListItem", position: index + 1,
        name: item.title, url: `https://newtacommercialsales.com/equipment/${item.slug}` })) },
  };
  const breadcrumbs = {
    "@context": "https://schema.org", "@type": "BreadcrumbList",
    itemListElement: [
      ["Home", "https://newtacommercialsales.com"],
      ["Commercial Assets", "https://newtacommercialsales.com/equipment"],
      ["Plant & Machinery", "https://newtacommercialsales.com/equipment/plant-machinery-for-sale-south-africa"],
      [subcategory.name, url],
    ].map(([name, item], index) => ({ "@type": "ListItem", position: index + 1, name, item })),
  };
  return <>
    {[structuredData, breadcrumbs].map((data, index) => <script key={index} type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }} />)}
    <Navbar />
    <main className="min-h-screen bg-[#FAF8F2]">
      <section className="bg-gradient-to-r from-green-950 via-green-900 to-green-800 pt-44 pb-16 text-white">
        <div className="mx-auto max-w-7xl px-6">
          <nav aria-label="Breadcrumb" className="mb-8 text-sm text-gray-300">
            <Link href="/" className="hover:text-[#D4AF37]">Home</Link><span className="mx-2">/</span>
            <Link href="/equipment" className="hover:text-[#D4AF37]">Commercial Assets</Link><span className="mx-2">/</span>
            <Link href="/equipment/plant-machinery-for-sale-south-africa" className="hover:text-[#D4AF37]">Plant &amp; Machinery</Link><span className="mx-2">/</span>
            <span className="text-[#D4AF37]">{subcategory.name}</span>
          </nav>
          <span className="inline-block rounded-full bg-[#D4AF37] px-5 py-2 text-sm font-bold uppercase tracking-wider text-[#0B2F24]">Private Treaty Sales</span>
          <h1 className="mt-6 max-w-5xl text-4xl font-extrabold leading-tight md:text-6xl">{title}</h1>
          <p className="mt-6 max-w-4xl text-lg leading-8 text-gray-200">{description} View available specifications, photographs, advertised prices and enquiry details for each listed asset.</p>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-6 py-16">
        <h2 className="text-3xl font-bold text-[#0B2F24]">Available Engineering &amp; Workshop Machinery</h2>
        {equipment.length > 0 ? <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {equipment.map(item => <EquipmentCard key={String(item._id)} id={item.slug} slug={item.slug}
            image={item.images?.find((image: any) => image.cover)?.url ?? item.images?.[0]?.url ?? "/placeholder-equipment.jpg"}
            title={item.title} year={item.year} status={item.status} price={`${item.currency ?? "ZAR"} ${item.price}`}
            hours={item.kmHours} usageUnit={item.usageUnit} location={item.province} />)}
        </div> : <div className="mt-10 rounded-2xl border bg-white p-10 text-center shadow-sm">
          <p className="text-xl font-bold text-[#0B2F24]">No engineering or workshop machinery currently available in this category.</p>
          <p className="mt-3 text-gray-600">Please check back for new listings or contact NEWTA about your requirements.</p>
          <Link href="/equipment" className="mt-6 inline-block rounded-xl bg-[#D4AF37] px-6 py-3 font-bold text-[#0B2F24]">View All Commercial Assets</Link>
        </div>}
      </section>
      <section className="border-t bg-white">
        <div className="mx-auto max-w-7xl px-6 py-16">
          <h2 className="text-3xl font-bold text-[#0B2F24]">Used Lathes, Milling Machines &amp; Workshop Equipment</h2>
          <p className="mt-5 max-w-4xl leading-8 text-gray-600">This category covers metalworking, engineering and workshop machinery for businesses across South Africa. Availability varies; the listings above show the assets currently available through NEWTA.</p>
          <ul className="mt-6 grid list-disc gap-2 pl-5 text-gray-600 sm:grid-cols-2">{machineryTypes.map(type => <li key={type}>{type}</li>)}</ul>
          <p className="mt-6 max-w-4xl leading-8 text-gray-600">Check each listing for its stated condition, specifications and location. Contact NEWTA to discuss a listed machine or a specific machinery requirement.</p>
          <Link href="/contact" className="mt-6 inline-block rounded-xl bg-[#D4AF37] px-6 py-3 font-bold text-[#0B2F24]">Enquire with NEWTA</Link>
        </div>
      </section>
    </main>
    <Footer />
  </>;
}
