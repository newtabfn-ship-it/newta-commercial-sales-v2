import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import { directSaleCategories } from "@/lib/directSales";
import { eligiblePublicPortfolios, portfolioPath } from "@/lib/directSalesPublicPortfolios";
import connectDB from "@/lib/mongodb";
import DirectSaleAsset from "@/models/DirectSaleAsset";
import AssetCard from "./AssetCard";

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
  const portfoliosPromise = eligiblePublicPortfolios().catch(() => []);
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
  const portfolios = await portfoliosPromise;
  return (
    <>
      <Navbar />
      <main className="bg-[#FAF8F2]">
        <header className="bg-[#0B2F24] pb-7 pt-48 text-left text-white sm:pt-44">
          <div className="mx-auto max-w-7xl px-6">
            <p className="text-sm font-bold tracking-wider text-[#D4AF37]">NEWTA COMMERCIAL SALES | DIRECT SALES — EXPRESSIONS OF INTEREST (EOI)</p>
            <h1 className="mt-3 text-3xl font-extrabold leading-tight sm:text-4xl xl:text-5xl">
              SEE THE PRICE. MAKE YOUR OFFER.
            </h1>
            <p className="mt-3 max-w-3xl text-base leading-relaxed text-gray-100">
              Every asset has an advertised price. Submit your offer online. NEWTA discusses it with the seller and gets back to you.
            </p>
            <a href="#direct-assets" className="mt-5 inline-block rounded-lg bg-[#D4AF37] px-5 py-3 text-sm font-bold text-[#0B2F24] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#D4AF37]">
              VIEW ASSETS &amp; MAKE AN OFFER
            </a>
            <ol aria-label="How Direct Sales works" className="mt-6 grid grid-cols-2 gap-x-4 gap-y-3 border-t border-white/20 pt-4 text-sm font-semibold sm:flex sm:flex-wrap sm:gap-5">
              {["Find Asset", "See Price", "Make Offer", "Get Feedback"].map((step, index) => (
                <li key={step} className="flex items-center gap-3">
                  <span>{step}</span>
                  {index < 3 && <span aria-hidden="true" className="text-[#D4AF37]">→</span>}
                </li>
              ))}
            </ol>
          </div>
        </header>
        <section className="mx-auto max-w-7xl px-6 py-7" aria-labelledby="direct-assets">
          <h2 id="direct-assets" className="scroll-mt-52 text-2xl font-bold text-[#0B2F24]">Available Direct Sales Assets</h2>
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
            {assets.slice(0, pageSize).map(asset => <AssetCard key={String(asset._id)} asset={asset} />)}
          </div>
          <nav aria-label="Asset pages" className="mt-8 flex gap-5">
            {page > 1 && <Link className="underline" href={pageUrl(page - 1)}>Previous page</Link>}
            {assets.length > pageSize && page < 1000 && <Link className="underline" href={pageUrl(page + 1)}>Next page</Link>}
          </nav>
        </section>
        {portfolios.length > 0 && <section className="mx-auto max-w-7xl px-6 pb-10" aria-labelledby="sales-portfolios">
          <h2 id="sales-portfolios" className="text-2xl font-bold text-[#0B2F24]">Sales Portfolios</h2>
          <p className="mt-2">Browse Sales Portfolios with assets currently open for offers.</p>
          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {portfolios.map(portfolio => <article key={portfolio.id} className="rounded-xl border border-[#D4AF37]/50 bg-white p-5">
              <h3 className="break-words text-xl font-bold text-[#0B2F24]"><Link href={portfolioPath(portfolio.slug)} className="underline">{portfolio.title}</Link></h3>
              {portfolio.description && <p className="mt-3 break-words">{portfolio.description.slice(0, 180)}{portfolio.description.length > 180 ? "…" : ""}</p>}
            </article>)}
          </div>
        </section>}
      </main>
      <Footer />
    </>
  );
}
