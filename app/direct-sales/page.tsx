import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import { cloudinaryImage } from "@/lib/cloudinaryImage";
import { acceptsOffers, directSaleCategories, formatRand } from "@/lib/directSales";
import connectDB from "@/lib/mongodb";
import DirectSaleAsset from "@/models/DirectSaleAsset";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Direct Asset Sales — Expressions of Interest (EOI)",
  description: "Browse NEWTA’s Direct Asset Sales — Expressions of Interest (EOI) listings and submit a private offer on commercial assets in South Africa.",
  alternates: { canonical: "/direct-sales" },
};

export default async function DirectSalesPage({ searchParams }: {
  searchParams: Promise<{ category?: string; page?: string }>;
}) {
  const params = await searchParams;
  const category = directSaleCategories.find(({ slug }) => slug === params.category);
  const page = Math.max(1, Math.min(1000, Math.trunc(Number(params.page) || 1)));
  const pageSize = 24;
  const pageUrl = (number: number) => {
    const query = new URLSearchParams();
    if (category) query.set("category", category.slug);
    if (number > 1) query.set("page", String(number));
    return query.size ? `/direct-sales?${query}` : "/direct-sales";
  };
  await connectDB();
  const assets = await DirectSaleAsset.find({
    status: "Published",
    $or: [{ closesAt: null }, { closesAt: { $gt: new Date() } }],
    ...(category ? { category: category.slug } : {}),
  })
    .select("slug title location status closesAt askingPriceCents images")
    .sort({ createdAt: -1, _id: -1 }).skip((page - 1) * pageSize).limit(pageSize + 1).lean();
  return (
    <>
      <Navbar />
      <main className="bg-[#FAF8F2]">
        <header className="bg-[#0B2F24] pb-16 pt-44 text-left text-white">
          <div className="mx-auto max-w-7xl px-6">
            <p className="text-sm font-bold tracking-widest text-[#D4AF37]">NEWTA COMMERCIAL SALES</p>
            <h1 className="mt-3 text-3xl font-extrabold leading-tight sm:text-4xl xl:text-5xl">
              Direct Asset Sales — Expressions of Interest (EOI)
            </h1>
            <p className="mt-2 text-lg font-bold text-[#D4AF37] sm:text-xl">MAKE AN OFFER</p>
            <p className="mt-3 text-base sm:text-lg">Your Offer. Our Consideration. A New Beginning.</p>
            <p className="mt-5 max-w-xl text-gray-200">
              Browse commercial assets and submit a private offer to NEWTA. For external bidding events, visit <Link href="/online-auctions-south-africa" className="underline">Online Auctions</Link>.
            </p>
          </div>
        </header>
        <section className="mx-auto max-w-7xl px-6 py-12" aria-labelledby="direct-assets">
          <h2 id="direct-assets" className="text-2xl font-bold text-[#0B2F24]">Browse Direct Sales assets</h2>
          <nav aria-label="Direct Sales categories" className="my-6 flex flex-wrap gap-2">
            {[{ slug: "", name: "All categories" }, ...directSaleCategories].map(({ slug, name }) => (
              <Link key={slug} href={slug ? `/direct-sales?category=${slug}` : "/direct-sales"}
                aria-current={(category?.slug ?? "") === slug ? "page" : undefined}
                className="rounded-lg border border-[#0B2F24] px-4 py-2 text-[#0B2F24] aria-[current=page]:bg-[#0B2F24] aria-[current=page]:text-white">
                {name}
              </Link>
            ))}
          </nav>
          {!assets.length && <p>No assets are open for offers in this selection. Please check back soon.</p>}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {assets.slice(0, pageSize).map((asset) => (
              <article key={String(asset._id)} className="overflow-hidden rounded-2xl bg-white shadow">
                <Image src={cloudinaryImage(asset.images.find(({ cover }) => cover)?.url ?? asset.images[0]?.url ?? "/placeholder-equipment.jpg")}
                  alt={asset.title} width={800} height={600} className="h-52 w-full object-cover" />
                <div className="space-y-2 p-5">
                  <p className="text-sm font-semibold text-[#0B2F24]">{acceptsOffers(asset) ? "Offers open" : "Offers closed"}</p>
                  <h3 className="text-xl font-bold">{asset.title}</h3>
                  {asset.location && <p>{asset.location}</p>}
                  {asset.askingPriceCents != null && <p>Asking price: {formatRand(asset.askingPriceCents)}</p>}
                  <Link href={`/direct-sales/${asset.slug}`} className="inline-block rounded-lg bg-[#D4AF37] px-4 py-2 font-bold text-[#0B2F24]">View asset →</Link>
                </div>
              </article>
            ))}
          </div>
          <nav aria-label="Asset pages" className="mt-8 flex gap-5">
            {page > 1 && <Link className="underline" href={pageUrl(page - 1)}>Previous page</Link>}
            {assets.length > pageSize && page < 1000 && <Link className="underline" href={pageUrl(page + 1)}>Next page</Link>}
          </nav>
        </section>
      </main>
      <Footer />
    </>
  );
}
