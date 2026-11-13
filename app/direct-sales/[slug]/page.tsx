import { cache } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import EquipmentGallery from "@/app/components/EquipmentGallery";
import { acceptsOffers, formatRand, publicAssetStatuses } from "@/lib/directSales";
import connectDB from "@/lib/mongodb";
import DirectSaleAsset from "@/models/DirectSaleAsset";
import OfferForm from "../OfferForm";

export const dynamic = "force-dynamic";
type Props = { params: Promise<{ slug: string }> };

const getAsset = cache(async (slug: string) => {
  await connectDB();
  return DirectSaleAsset.findOne({ slug, status: { $in: publicAssetStatuses } }).lean();
});

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const asset = await getAsset((await params).slug);
  if (!asset) return { title: "Direct Sales asset not found", robots: { index: false } };
  return {
    title: `${asset.title} | Direct Asset Sales — Expressions of Interest (EOI)`,
    description: `View ${asset.title}, reference ${asset.referenceNumber}, in NEWTA’s Direct Asset Sales — Expressions of Interest (EOI) catalogue.`,
    alternates: { canonical: `/direct-sales/${asset.slug}` },
    robots: { index: acceptsOffers(asset), follow: true },
  };
}

export default async function DirectSaleAssetPage({ params }: Props) {
  const asset = await getAsset((await params).slug);
  if (!asset) notFound();
  const open = acceptsOffers(asset);
  const availability = open ? "Offers open" : asset.status === "Sold" ? "Sold" : "Offers closed";
  return (
    <>
      <Navbar />
      <main className="bg-[#FAF8F2] px-6 pb-16 pt-40">
        <div className="mx-auto max-w-6xl">
          <Link href="/direct-sales" className="font-semibold text-[#0B2F24] underline">Back to Direct Asset Sales — Expressions of Interest (EOI)</Link>
          <p className="mt-6 font-bold text-[#0B2F24]">{availability}</p>
          <h1 className="mt-2 text-3xl font-extrabold text-[#0B2F24] md:text-5xl">{asset.title}</h1>
          <p className="mt-3">Reference: {asset.referenceNumber}</p>
          {asset.location && <p>{asset.location}</p>}
          {asset.askingPriceCents != null && <p className="mt-3 text-xl font-bold">Asking price: {formatRand(asset.askingPriceCents)}</p>}
          {asset.closesAt && <p className="mt-3">Offer closing time: <time dateTime={asset.closesAt.toISOString()}>
            {new Intl.DateTimeFormat("en-ZA", { dateStyle: "long", timeStyle: "short", timeZone: "Africa/Johannesburg" }).format(asset.closesAt)} SAST
          </time></p>}
          {asset.images.length > 0 && <div className="mt-8">
            <EquipmentGallery images={asset.images.map(({ url, publicId, cover }) => ({ url, publicId, cover }))} title={asset.title} availabilityLabel={availability} />
          </div>}
          <div className="mt-8 grid gap-8 lg:grid-cols-2">
            <section className="space-y-4">
              {asset.description && <><h2 className="text-xl font-bold">Description</h2><p className="whitespace-pre-wrap">{asset.description}</p></>}
              {asset.specifications && <><h2 className="text-xl font-bold">Specifications</h2><p className="whitespace-pre-wrap">{asset.specifications}</p></>}
            </section>
            <section className="rounded-2xl border border-[#D4AF37]/40 bg-white p-6">
              {open ? <OfferForm assetId={String(asset._id)} reference={asset.referenceNumber} /> : <p>This asset is no longer accepting offers.</p>}
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
