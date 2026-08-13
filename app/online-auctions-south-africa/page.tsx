import type { Metadata } from "next";
import Link from "next/link";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export const metadata: Metadata = {
  title: "Online Auctions South Africa | NEWTA Commercial Sales",
  description:
    "Online auctions in South Africa through NEWTA Commercial Sales. If you have commercial vehicles, trucks, machinery, plant, industrial assets or other business assets to sell by auction, contact NEWTA.",
  keywords: [
    "online auctions South Africa",
    "online auctions",
    "commercial auctions South Africa",
    "machinery auctions South Africa",
    "truck auctions South Africa",
    "plant auctions South Africa",
    "equipment auctions South Africa",
    "asset auctions South Africa",
    "NEWTA Commercial Sales",
  ],
  alternates: {
    canonical:
      "https://newtacommercialsales.com/online-auctions-south-africa",
  },
  openGraph: {
    title: "Online Auctions South Africa | NEWTA Commercial Sales",
    description:
      "NEWTA Commercial Sales can assist with the sale of commercial vehicles, trucks, machinery, plant and industrial assets through online auctions.",
    url: "https://newtacommercialsales.com/online-auctions-south-africa",
    siteName: "NEWTA Commercial Sales",
    locale: "en_ZA",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function OnlineAuctionsSouthAfrica() {
  return (
    <>
      <Navbar />

      {/* HERO */}
      <section className="bg-[#0B2F24] text-white pt-44 pb-20">
        <div className="mx-auto max-w-7xl px-6">
          <span className="inline-block rounded-full bg-[#D4AF37] px-5 py-2 text-sm font-bold uppercase tracking-wider text-[#0B2F24]">
            Online Auctions
          </span>

          <h1 className="mt-7 max-w-5xl text-4xl font-extrabold leading-tight md:text-6xl">
            Online Auctions in South Africa
          </h1>

          <p className="mt-6 max-w-3xl text-xl leading-8 text-gray-300">
            NEWTA Commercial Sales assists clients with the sale of commercial
            vehicles, trucks, bakkies, machinery, plant, industrial assets and
            other commercial equipment through online auctions.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="#sell-by-auction"
              className="rounded-xl bg-[#D4AF37] px-7 py-4 font-bold text-[#0B2F24] transition hover:opacity-90"
            >
              Sell Your Assets by Auction
            </Link>

            <Link
              href="#auctions"
              className="rounded-xl border border-white/30 bg-white/10 px-7 py-4 font-bold text-white transition hover:bg-white/20"
            >
              View Auction Information
            </Link>
          </div>
        </div>
      </section>

      {/* INTRO */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-5xl px-6">
          <h2 className="text-3xl font-extrabold text-[#0B2F24] md:text-4xl">
            Online Auction Services
          </h2>

          <div className="mt-6 space-y-5 text-lg leading-8 text-gray-700">
            <p>
              NEWTA Commercial Sales provides a practical route for businesses,
              companies and asset owners looking to sell commercial assets
              through online auctions.
            </p>

            <p>
              When an auction opportunity becomes available, NEWTA can arrange
              and market the asset for auction through our online auction
              platform partner.
            </p>

            <p>
              This allows sellers to reach registered online auction buyers
              while NEWTA handles the preparation, asset information and
              marketing required to present the asset professionally.
            </p>
          </div>
        </div>
      </section>

      {/* SELL BY AUCTION */}
      <section
        id="sell-by-auction"
        className="bg-[#FAF8F2] py-20"
      >
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <span className="text-sm font-bold uppercase tracking-widest text-[#D4AF37]">
                Selling an Asset?
              </span>

              <h2 className="mt-3 text-3xl font-extrabold text-[#0B2F24] md:text-5xl">
                Want to Sell Your Assets by Auction?
              </h2>

              <p className="mt-6 text-lg leading-8 text-gray-700">
                If you have assets that you would like to sell through an
                online auction, contact NEWTA Commercial Sales.
              </p>

              <p className="mt-4 text-lg leading-8 text-gray-700">
                We can discuss the asset with you, assist with the preparation
                and marketing, and determine the most suitable way to bring it
                to market.
              </p>

              <p className="mt-4 text-lg leading-8 text-gray-700">
                We work with a wide range of commercial assets, including
                trucks, bakkies, vehicles, trailers, construction machinery,
                agricultural equipment, plant, mining equipment, industrial
                assets and more.
              </p>

              <div className="mt-8">
                <Link
                  href="/contact"
                  className="inline-block rounded-xl bg-[#0B2F24] px-7 py-4 font-bold text-white transition hover:bg-[#123d30]"
                >
                  Contact NEWTA About an Auction
                </Link>
              </div>
            </div>

            <div className="rounded-3xl bg-[#0B2F24] p-8 text-white shadow-xl md:p-10">
              <h3 className="text-2xl font-bold text-[#D4AF37]">
                What Can Be Sold?
              </h3>

              <ul className="mt-6 space-y-4 text-lg text-gray-200">
                <li>• Commercial trucks and vehicles</li>
                <li>• Bakkies and cars</li>
                <li>• Trailers and truck tractors</li>
                <li>• Construction machinery</li>
                <li>• Agricultural equipment</li>
                <li>• Plant and machinery</li>
                <li>• Mining equipment</li>
                <li>• Industrial assets</li>
                <li>• Compressors and specialist equipment</li>
                <li>• Other commercial assets</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center">
            <span className="text-sm font-bold uppercase tracking-widest text-[#D4AF37]">
              The Process
            </span>

            <h2 className="mt-3 text-3xl font-extrabold text-[#0B2F24] md:text-4xl">
              How an Online Auction Works
            </h2>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-4">
            <div className="rounded-2xl border bg-[#FAF8F2] p-7">
              <div className="text-3xl font-black text-[#D4AF37]">01</div>

              <h3 className="mt-4 text-xl font-bold text-[#0B2F24]">
                Contact NEWTA
              </h3>

              <p className="mt-3 leading-7 text-gray-600">
                Tell us what asset you would like to sell and discuss the
                available options.
              </p>
            </div>

            <div className="rounded-2xl border bg-[#FAF8F2] p-7">
              <div className="text-3xl font-black text-[#D4AF37]">02</div>

              <h3 className="mt-4 text-xl font-bold text-[#0B2F24]">
                Asset Preparation
              </h3>

              <p className="mt-3 leading-7 text-gray-600">
                We gather the necessary information, specifications, images
                and details required to market the asset.
              </p>
            </div>

            <div className="rounded-2xl border bg-[#FAF8F2] p-7">
              <div className="text-3xl font-black text-[#D4AF37]">03</div>

              <h3 className="mt-4 text-xl font-bold text-[#0B2F24]">
                Online Auction
              </h3>

              <p className="mt-3 leading-7 text-gray-600">
                The asset is presented through the online auction platform to
                registered buyers.
              </p>
            </div>

            <div className="rounded-2xl border bg-[#FAF8F2] p-7">
              <div className="text-3xl font-black text-[#D4AF37]">04</div>

              <h3 className="mt-4 text-xl font-bold text-[#0B2F24]">
                Sale
              </h3>

              <p className="mt-3 leading-7 text-gray-600">
                The auction process is completed and the successful sale is
                handled through the relevant auction platform.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* AUCTIONS */}
      <section
        id="auctions"
        className="bg-[#0B2F24] py-20 text-white"
      >
        <div className="mx-auto max-w-5xl px-6 text-center">
          <span className="text-sm font-bold uppercase tracking-widest text-[#D4AF37]">
            Upcoming & Previous Auctions
          </span>

          <h2 className="mt-3 text-3xl font-extrabold md:text-4xl">
            Auctions Through Our Online Auction Partner
          </h2>

          <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-gray-300">
            When NEWTA has an asset going to auction, the relevant auction
            details and auction link can be made available here for buyers to
            access.
          </p>

          {/* CURRENT AUCTION PLACEHOLDER */}
          <div className="mt-10 rounded-2xl border border-white/10 bg-white/10 p-8">
            <p className="text-sm font-bold uppercase tracking-wider text-[#D4AF37]">
              Current Auction
            </p>

            <h3 className="mt-3 text-2xl font-bold">
              No Current Auction
            </h3>

            <p className="mt-3 text-gray-300">
              There are currently no NEWTA auctions being promoted. Check back
              when our next auction becomes available.
            </p>
          </div>
        </div>
      </section>

      {/* BIDPRO / PREVIOUS AUCTION */}
      <section className="bg-[#FAF8F2] py-20">
        <div className="mx-auto max-w-5xl px-6 text-center">
          <span className="text-sm font-bold uppercase tracking-widest text-[#D4AF37]">
            Auction Platform
          </span>

          <h2 className="mt-3 text-3xl font-extrabold text-[#0B2F24] md:text-4xl">
            Online Auction Listings
          </h2>

          <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-gray-700">
            Auction listings promoted by NEWTA may be hosted on our online
            auction platform partner. Auction links will be provided here when
            applicable.
          </p>

          <div className="mt-8">
            <a
              href="https://www.bidpro.co.za/AuctionDetails/1511"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block rounded-xl border-2 border-[#0B2F24] px-7 py-4 font-bold text-[#0B2F24] transition hover:bg-[#0B2F24] hover:text-white"
            >
              View Previous Auction
            </a>
          </div>

          <p className="mt-5 text-sm text-gray-500">
            Previous auction example — auction links will be updated when new
            NEWTA auctions become available.
          </p>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h2 className="text-3xl font-extrabold text-[#0B2F24] md:text-4xl">
            Have Commercial Assets to Sell?
          </h2>

          <p className="mt-5 text-lg leading-8 text-gray-700">
            Whether you are looking for a private treaty sale or would like to
            discuss selling your assets through an online auction, contact
            NEWTA Commercial Sales.
          </p>

          <div className="mt-8">
            <Link
              href="/contact"
              className="inline-block rounded-xl bg-[#D4AF37] px-8 py-4 font-bold text-[#0B2F24] transition hover:opacity-90"
            >
              Contact NEWTA Commercial Sales
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}