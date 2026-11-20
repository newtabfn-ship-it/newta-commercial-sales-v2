import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import AssetCard from "@/app/direct-sales/AssetCard";
import { getPublicPortfolioPage, portfolioPageNumber, portfolioPageSize, portfolioPath, portfolioUrl, salesBaseUrl } from "@/lib/directSalesPublicPortfolios";

export const dynamic = "force-dynamic";
type Props = {
  params: Promise<{ "portfolio-slug": string }>;
  searchParams: Promise<{ page?: string | string[] }>;
};

async function content({ params, searchParams }: Props) {
  const slug = (await params)["portfolio-slug"];
  const page = portfolioPageNumber((await searchParams).page);
  if (page === null) notFound();
  const data = await getPublicPortfolioPage(slug, page);
  if (!data) notFound();
  return data;
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const data = await content(props);
  const { portfolio, page } = data;
  const suffix = page > 1 ? ` — Page ${page}` : "";
  const title = (portfolio.seoTitle || portfolio.title + " | Sales Portfolio") + suffix;
  const description = portfolio.seoDescription || portfolio.description.slice(0, 320) ||
    `View ${portfolio.title} in NEWTA's Direct Sales — Expressions of Interest (EOI).`;
  const url = portfolioUrl(portfolio.slug, page);
  const index = portfolio.status === "Published" && data.assets.length > 0;
  return {
    title, description, alternates: { canonical: url },
    robots: { index, follow: true, googleBot: { index, follow: true } },
    openGraph: { type: "website", locale: "en_ZA", siteName: "NEWTA Commercial Sales", title, description, url,
      images: [{ url: data.shareImage, alt: portfolio.title }] },
    twitter: { card: "summary_large_image", title, description, images: [data.shareImage] },
  };
}

export default async function SalesPortfolioPage(props: Props) {
  const { portfolio, assets, hasMore, page, shareImage } = await content(props);
  const archived = portfolio.status === "Archived";
  const list = { "@context": "https://schema.org", "@type": "ItemList", name: portfolio.title,
    url: portfolioUrl(portfolio.slug, page), itemListElement: assets.map((asset, index) => ({
      "@type": "ListItem", position: (page - 1) * portfolioPageSize + index + 1,
      name: asset.title, url: salesBaseUrl + "/direct-sales/" + asset.slug,
    })) };
  return <>
    <Navbar />
    <main className="min-h-screen bg-[#FAF8F2] pb-16 pt-44">
      <header className="bg-[#0B2F24] px-6 py-7 text-white">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm font-bold tracking-wider text-[#D4AF37]">NEWTA COMMERCIAL SALES | SALES PORTFOLIO</p>
          {/* Native image: no server-side fetch of administrator-provided URLs. */}
          <img src={shareImage} alt={portfolio.title + " — Sales Portfolio cover"} width={1200} height={800}
            referrerPolicy="no-referrer" decoding="async" className="mt-4 max-h-80 w-full rounded-xl object-contain" />
          <h1 className="mt-3 break-words text-3xl font-extrabold sm:text-4xl">{portfolio.title}</h1>
          {portfolio.description && <p className="mt-4 max-w-4xl whitespace-pre-wrap break-words">{portfolio.description}</p>}
          <Link href="/direct-sales" className="mt-5 inline-block font-semibold text-[#D4AF37] underline">View all Direct Sales assets</Link>
        </div>
      </header>
      <section className="mx-auto max-w-7xl px-6 py-8">
        {archived ? <div className="rounded-xl border border-[#D4AF37] bg-white p-6">
          <h2 className="text-2xl font-bold text-[#0B2F24]">Archived Sales Portfolio</h2>
          <p className="mt-3">This Sales Portfolio is archived and is not presented as available stock. Individual assets may still be available in the main Direct Sales catalogue.</p>
        </div> : <>
          <h2 className="text-2xl font-bold text-[#0B2F24]">Available Sales Portfolio Assets</h2>
          {!assets.length && <p className="mt-4">No assets are currently open for offers in this Sales Portfolio. Please check back or browse all Direct Sales assets.</p>}
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {assets.map(asset => <AssetCard key={asset._id} asset={asset} />)}
          </div>
          <nav aria-label="Sales Portfolio asset pages" className="mt-8 flex flex-wrap gap-5">
            {page > 1 && <Link href={portfolioPath(portfolio.slug, page - 1)} className="underline">Previous page</Link>}
            {hasMore && page < 1000 && <Link href={portfolioPath(portfolio.slug, page + 1)} className="underline">Next page</Link>}
          </nav>
          {assets.length > 0 && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(list).replace(/</g, "\\u003c") }} />}
        </>}
      </section>
    </main>
    <Footer />
  </>;
}
