import type { Metadata } from "next";
import Link from "next/link";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export const metadata: Metadata = {
  title:
    "Online Auctions South Africa | Trucks, Machinery & Commercial Assets | NEWTA",
  description:
    "Online auctions in South Africa for trucks, commercial vehicles, bakkies, machinery, plant, industrial equipment and business assets. Contact NEWTA Commercial Sales to discuss selling assets by online auction.",
  keywords: [
    "online auctions South Africa",
    "online auctions for trucks South Africa",
    "truck auctions South Africa",
    "machinery auctions South Africa",
    "plant auctions South Africa",
    "commercial vehicle auctions South Africa",
    "equipment auctions South Africa",
    "industrial auctions South Africa",
    "asset auctions South Africa",
    "online machinery auctions",
    "online truck auctions",
    "commercial assets for auction",
    "NEWTA Commercial Sales",
  ],
  alternates: {
    canonical:
      "https://newtacommercialsales.com/online-auctions-south-africa",
  },
  openGraph: {
    title:
      "Online Auctions South Africa | Trucks, Machinery & Commercial Assets | NEWTA",
    description:
      "Sell trucks, commercial vehicles, machinery, plant, industrial equipment and other commercial assets through online auctions with NEWTA Commercial Sales.",
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
      <section className="bg-[#0B2F24] pt-44 pb-20 text-white">
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
  NEWTA Commercial Sales provides online auction services in South Africa
  for businesses, companies and asset owners looking to sell commercial
  vehicles, trucks, bakkies, machinery, plant, industrial equipment and
  other business assets.
</p>

<p>
  Online auctions can provide an effective sales route for commercial
  assets where competitive bidding and access to a wider audience of
  registered buyers may be beneficial. Depending on the asset and the
  proposed sale, NEWTA can assist with preparing and marketing assets
  for sale through an online auction platform.
</p>

<p>
  Assets that may be suitable for online auction include trucks, truck
  tractors, trailers, commercial vehicles, construction machinery,
  agricultural equipment, plant and machinery, mining equipment,
  compressors, industrial equipment and other commercial assets.
</p>

<p>
  If you are considering selling commercial assets by auction in South
  Africa, contact NEWTA Commercial Sales to discuss your assets and the
  available selling options.
</p>
          </div>
        </div>
      </section>

      {/* SELL BY AUCTION */}
      <section id="sell-by-auction" className="bg-[#FAF8F2] py-20">
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
      <section id="auctions" className="bg-[#0B2F24] py-20 text-white">
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

          {/* CURRENT AUCTION */}
<div className="mt-10 rounded-2xl border border-[#D4AF37]/40 bg-white/10 p-8 text-left">
  <p className="text-sm font-bold uppercase tracking-wider text-[#D4AF37]">
    Upcoming Auction
  </p>

  <h3 className="mt-3 text-2xl font-bold md:text-3xl">
    NEWTA Truck, Construction & Agri Online Auction
  </h3>

  <p className="mt-4 text-lg leading-8 text-gray-300">
    NEWTA Commercial Sales is promoting an upcoming online auction featuring
    trucks, construction equipment and agricultural assets.
  </p>

  <div className="mt-6 grid gap-4 sm:grid-cols-2">
    <div className="rounded-xl bg-white/10 p-4">
      <p className="text-sm font-bold uppercase tracking-wider text-[#D4AF37]">
        Auction Starts
      </p>
      <p className="mt-1 font-semibold text-white">
        6 October 2026 at 07:00
      </p>
    </div>

    <div className="rounded-xl bg-white/10 p-4">
      <p className="text-sm font-bold uppercase tracking-wider text-[#D4AF37]">
        Auction Closes
      </p>
      <p className="mt-1 font-semibold text-white">
        8 October 2026 at 09:00
      </p>
    </div>

    <div className="rounded-xl bg-white/10 p-4">
      <p className="text-sm font-bold uppercase tracking-wider text-[#D4AF37]">
        Location
      </p>
      <p className="mt-1 font-semibold text-white">
        Free State, South Africa
      </p>
    </div>

    <div className="rounded-xl bg-white/10 p-4">
      <p className="text-sm font-bold uppercase tracking-wider text-[#D4AF37]">
        Auction Type
      </p>
      <p className="mt-1 font-semibold text-white">
        Timed Online Auction
      </p>
    </div>
  </div>

  <div className="mt-7">
    <p className="text-gray-300">
      The auction is conducted through our online auction partner. Buyers can
      view the auction details, register and participate through the BidPro
      auction platform.
    </p>
  </div>

  <div className="mt-8 flex flex-wrap gap-4">
    <a
      href="https://www.bidpro.co.za/AuctionDetails/1591"
      target="_blank"
      rel="noopener noreferrer"
      className="inline-block rounded-xl bg-[#D4AF37] px-7 py-4 font-bold text-[#0B2F24] transition hover:opacity-90"
    >
      View Auction & Bid →
    </a>

    <Link
      href="/contact"
      className="inline-block rounded-xl border border-white/30 bg-white/10 px-7 py-4 font-bold text-white transition hover:bg-white/20"
    >
      Contact NEWTA
    </Link>
  </div>
</div>
        </div>
      </section>

   {/* PREVIOUS ONLINE AUCTIONS */}
<section className="bg-[#FAF8F2] py-20">
  <div className="mx-auto max-w-7xl px-6">

    <div className="text-center">
      <span className="text-sm font-bold uppercase tracking-widest text-[#D4AF37]">
        Previous Auctions
      </span>

      <h2 className="mt-3 text-3xl font-extrabold text-[#0B2F24] md:text-4xl">
        Previous Online Auctions
      </h2>

      <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-gray-700">
        NEWTA Commercial Sales has promoted a range of online auctions
        involving trucks, trailers, plant, machinery, vehicles, industrial
        assets, automotive spares and other commercial assets.
      </p>
    </div>

    <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">

      {/* Auction 1 */}
      <div className="rounded-2xl bg-white p-7 shadow-lg transition hover:-translate-y-1 hover:shadow-xl">
        <span className="text-sm font-bold uppercase tracking-wider text-[#D4AF37]">
          Previous Auction
        </span>

        <h3 className="mt-3 text-xl font-bold text-[#0B2F24]">
          Crushing, Screening, Trucks, Trailers & Equipment
        </h3>

        <a
          href="https://www.bidpro.co.za/AuctionDetails/1511"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-block rounded-xl bg-[#0B2F24] px-5 py-3 font-bold text-white transition hover:bg-[#D4AF37] hover:text-[#0B2F24]"
        >
          View Auction →
        </a>
      </div>

      {/* Auction 2 */}
      <div className="rounded-2xl bg-white p-7 shadow-lg transition hover:-translate-y-1 hover:shadow-xl">
        <span className="text-sm font-bold uppercase tracking-wider text-[#D4AF37]">
          Previous Auction
        </span>

        <h3 className="mt-3 text-xl font-bold text-[#0B2F24]">
          Online Movable Asset Disposal - NC
        </h3>

        <a
          href="https://www.bidpro.co.za/AuctionDetails/1502"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-block rounded-xl bg-[#0B2F24] px-5 py-3 font-bold text-white transition hover:bg-[#D4AF37] hover:text-[#0B2F24]"
        >
          View Auction →
        </a>
      </div>

      {/* Auction 3 */}
      <div className="rounded-2xl bg-white p-7 shadow-lg transition hover:-translate-y-1 hover:shadow-xl">
        <span className="text-sm font-bold uppercase tracking-wider text-[#D4AF37]">
          Previous Auction
        </span>

        <h3 className="mt-3 text-xl font-bold text-[#0B2F24]">
          Fleet Disposal Auction
        </h3>

        <a
          href="https://www.bidpro.co.za/AuctionDetails/1508"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-block rounded-xl bg-[#0B2F24] px-5 py-3 font-bold text-white transition hover:bg-[#D4AF37] hover:text-[#0B2F24]"
        >
          View Auction →
        </a>
      </div>

      {/* Auction 4 */}
      <div className="rounded-2xl bg-white p-7 shadow-lg transition hover:-translate-y-1 hover:shadow-xl">
        <span className="text-sm font-bold uppercase tracking-wider text-[#D4AF37]">
          Previous Auction
        </span>

        <h3 className="mt-3 text-xl font-bold text-[#0B2F24]">
          NEWTA FS&NC Plant, Trucks, & Equipment Auction
        </h3>

        <a
          href="https://www.bidpro.co.za/AuctionDetails/1480"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-block rounded-xl bg-[#0B2F24] px-5 py-3 font-bold text-white transition hover:bg-[#D4AF37] hover:text-[#0B2F24]"
        >
          View Auction →
        </a>
      </div>

      {/* Auction 5 */}
      <div className="rounded-2xl bg-white p-7 shadow-lg transition hover:-translate-y-1 hover:shadow-xl">
        <span className="text-sm font-bold uppercase tracking-wider text-[#D4AF37]">
          Previous Auction
        </span>

        <h3 className="mt-3 text-xl font-bold text-[#0B2F24]">
          Corporate Assets Disposal Sale
        </h3>

        <a
          href="https://www.bidpro.co.za/AuctionDetails/1388"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-block rounded-xl bg-[#0B2F24] px-5 py-3 font-bold text-white transition hover:bg-[#D4AF37] hover:text-[#0B2F24]"
        >
          View Auction →
        </a>
      </div>

      {/* Auction 6 */}
      <div className="rounded-2xl bg-white p-7 shadow-lg transition hover:-translate-y-1 hover:shadow-xl">
        <span className="text-sm font-bold uppercase tracking-wider text-[#D4AF37]">
          Previous Auction
        </span>

        <h3 className="mt-3 text-xl font-bold text-[#0B2F24]">
          Year End Clearance Sale - Free State
        </h3>

        <a
          href="https://www.bidpro.co.za/AuctionDetails/1286"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-block rounded-xl bg-[#0B2F24] px-5 py-3 font-bold text-white transition hover:bg-[#D4AF37] hover:text-[#0B2F24]"
        >
          View Auction →
        </a>
      </div>

      {/* Auction 7 */}
      <div className="rounded-2xl bg-white p-7 shadow-lg transition hover:-translate-y-1 hover:shadow-xl">
        <span className="text-sm font-bold uppercase tracking-wider text-[#D4AF37]">
          Previous Auction
        </span>

        <h3 className="mt-3 text-xl font-bold text-[#0B2F24]">
          Loose Assets and Automotive Spares and Projects
        </h3>

        <a
          href="https://www.bidpro.co.za/AuctionDetails/1274"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-block rounded-xl bg-[#0B2F24] px-5 py-3 font-bold text-white transition hover:bg-[#D4AF37] hover:text-[#0B2F24]"
        >
          View Auction →
        </a>
      </div>

      {/* Auction 8 */}
      <div className="rounded-2xl bg-white p-7 shadow-lg transition hover:-translate-y-1 hover:shadow-xl">
        <span className="text-sm font-bold uppercase tracking-wider text-[#D4AF37]">
          Previous Auction
        </span>

        <h3 className="mt-3 text-xl font-bold text-[#0B2F24]">
          Grand Final Sale
        </h3>

        <a
          href="https://www.bidpro.co.za/AuctionDetails/1324"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-block rounded-xl bg-[#0B2F24] px-5 py-3 font-bold text-white transition hover:bg-[#D4AF37] hover:text-[#0B2F24]"
        >
          View Auction →
        </a>
      </div>

    </div>

    <p className="mx-auto mt-10 max-w-3xl text-center text-sm leading-6 text-gray-500">
      Previous auction listings are provided as examples of auctions promoted
      by NEWTA Commercial Sales. Future NEWTA auction opportunities will be
      added to this page when available.
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