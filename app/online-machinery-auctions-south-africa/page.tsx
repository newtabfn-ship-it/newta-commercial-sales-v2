import type { Metadata } from "next";
import Link from "next/link";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export const metadata: Metadata = {
  title:
    "Online Machinery Auctions South Africa | Plant & Machinery Auctions | NEWTA Commercial Sales",
  description:
    "Online machinery auctions in South Africa for plant, construction equipment, mining equipment, agricultural machinery, cranes, compressors and industrial assets. NEWTA Commercial Sales assists with preparing and marketing commercial assets for online auction.",
  keywords: [
    "online machinery auctions South Africa",
    "machinery auctions South Africa",
    "online equipment auctions South Africa",
    "plant auctions South Africa",
    "plant and machinery auctions South Africa",
    "construction equipment auctions South Africa",
    "construction machinery auctions South Africa",
    "mining equipment auctions South Africa",
    "agricultural equipment auctions South Africa",
    "crane auctions South Africa",
    "compressor auctions South Africa",
    "industrial equipment auctions South Africa",
    "heavy equipment auctions South Africa",
    "online plant auctions South Africa",
    "NEWTA Commercial Sales",
  ],
  alternates: {
    canonical:
      "https://newtacommercialsales.com/online-machinery-auctions-south-africa",
  },
  openGraph: {
    title:
      "Online Machinery Auctions South Africa | Plant & Machinery Auctions | NEWTA Commercial Sales",
    description:
      "Online machinery auctions in South Africa for plant, construction equipment, mining equipment, agricultural machinery, cranes, compressors and industrial assets through NEWTA Commercial Sales.",
    url: "https://newtacommercialsales.com/online-machinery-auctions-south-africa",
    siteName: "NEWTA Commercial Sales",
    locale: "en_ZA",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function OnlineMachineryAuctionsSouthAfricaPage() {
  return (
    <>
      <Navbar />

      {/* HERO */}
      <section className="bg-[#0B2F24] pt-44 pb-20 text-white">
        <div className="mx-auto max-w-7xl px-6">
          <span className="inline-block rounded-full bg-[#D4AF37] px-5 py-2 text-sm font-bold uppercase tracking-wider text-[#0B2F24]">
            Online Machinery Auctions
          </span>

          <h1 className="mt-7 max-w-5xl text-4xl font-extrabold leading-tight md:text-6xl">
            Online Machinery Auctions South Africa
          </h1>

          <p className="mt-6 max-w-3xl text-xl leading-8 text-gray-300">
            NEWTA Commercial Sales assists with the sale of plant, machinery,
            construction equipment, mining equipment, agricultural machinery,
            cranes, compressors and other industrial assets through online
            auctions in South Africa. Auction opportunities are separate from
            NEWTA's private-treaty equipment listings.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="#sell-by-auction"
              className="rounded-xl bg-[#D4AF37] px-7 py-4 font-bold text-[#0B2F24] transition hover:opacity-90"
            >
              Sell Your Machinery by Auction
            </Link>

            <Link
              href="#machinery-auctions"
              className="rounded-xl border border-white/30 bg-white/10 px-7 py-4 font-bold text-white transition hover:bg-white/20"
            >
              Machinery Auction Information
            </Link>
          </div>
        </div>
      </section>

      {/* INTRO */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-5xl px-6">
          <h2 className="text-3xl font-extrabold text-[#0B2F24] md:text-4xl">
            Online Machinery Auctions South Africa
          </h2>

          <div className="mt-6 space-y-5 text-lg leading-8 text-gray-700">
            <p>
              NEWTA Commercial Sales assists businesses, companies, contractors,
              fleet owners and asset owners with the preparation and marketing
              of plant, machinery and equipment for online auctions in South Africa.
            </p>

            <p>
              Online machinery auctions can provide access to registered
              buyers and may be suitable where competitive bidding forms part
              of the proposed sales process. NEWTA can assist with gathering
              asset information, specifications, images and other details
              required to market machinery for online auction.
            </p>

            <p>
              Equipment that may be considered for online auction includes
              construction machinery, earthmoving equipment, mining equipment,
              agricultural equipment, cranes, drilling rigs, compressors,
              crushing and screening equipment, industrial machinery and other
              plant and equipment.
            </p>

            <p>
              If you are looking for machinery auctions in South Africa or are
              considering selling plant and equipment through an online auction,
              contact NEWTA Commercial Sales to discuss your assets and the
              available selling options. NEWTA also offers private-treaty sales
              for commercial assets where that sales method is appropriate.
            </p>
          </div>
        </div>
      </section>

      {/* MACHINERY TYPES */}
      <section className="bg-[#FAF8F2] py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center">
            <span className="text-sm font-bold uppercase tracking-widest text-[#D4AF37]">
              Plant & Equipment
            </span>

            <h2 className="mt-3 text-3xl font-extrabold text-[#0B2F24] md:text-4xl">
              Machinery That May Be Offered Through Online Auction
            </h2>

            <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-gray-700">
              NEWTA works with a broad range of commercial, industrial,
              construction, mining and agricultural equipment. Depending on
              the asset, seller requirements and proposed sales process, these
              machines may be considered for online auction.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-2xl bg-white p-7 shadow-lg">
              <h3 className="text-xl font-bold text-[#0B2F24]">
                Construction Equipment
              </h3>
              <p className="mt-3 leading-7 text-gray-600">
                Excavators, TLBs, graders, loaders and other construction and
                earthmoving equipment.
              </p>
            </div>

            <div className="rounded-2xl bg-white p-7 shadow-lg">
              <h3 className="text-xl font-bold text-[#0B2F24]">
                Mining Equipment
              </h3>
              <p className="mt-3 leading-7 text-gray-600">
                Mining machinery and equipment used in mining, quarrying and
                related operations.
              </p>
            </div>

            <div className="rounded-2xl bg-white p-7 shadow-lg">
              <h3 className="text-xl font-bold text-[#0B2F24]">
                Crushing & Screening
              </h3>
              <p className="mt-3 leading-7 text-gray-600">
                Mobile crushers, screens and other equipment used for crushing,
                screening and material processing.
              </p>
            </div>

            <div className="rounded-2xl bg-white p-7 shadow-lg">
              <h3 className="text-xl font-bold text-[#0B2F24]">
                Cranes & Lifting Equipment
              </h3>
              <p className="mt-3 leading-7 text-gray-600">
                Cranes, lifting equipment and specialist machinery used for
                construction and industrial applications.
              </p>
            </div>

            <div className="rounded-2xl bg-white p-7 shadow-lg">
              <h3 className="text-xl font-bold text-[#0B2F24]">
                Agricultural Equipment
              </h3>
              <p className="mt-3 leading-7 text-gray-600">
                Agricultural machinery and equipment used for farming,
                production and related operations.
              </p>
            </div>

            <div className="rounded-2xl bg-white p-7 shadow-lg">
              <h3 className="text-xl font-bold text-[#0B2F24]">
                Industrial Machinery
              </h3>
              <p className="mt-3 leading-7 text-gray-600">
                Compressors, industrial machinery, specialist equipment and
                other commercial assets.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SELL BY AUCTION */}
      <section id="sell-by-auction" className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <span className="text-sm font-bold uppercase tracking-widest text-[#D4AF37]">
                Selling Machinery?
              </span>

              <h2 className="mt-3 text-3xl font-extrabold text-[#0B2F24] md:text-5xl">
                Want to Sell Your Machinery Through an Online Auction?
              </h2>

              <p className="mt-6 text-lg leading-8 text-gray-700">
                If you have machinery, plant or equipment that you would like
                to sell through an online auction, contact NEWTA Commercial
                Sales to discuss the asset and available sales options.
              </p>

              <p className="mt-4 text-lg leading-8 text-gray-700">
                We can discuss the equipment with you, gather relevant
                specifications and information, assist with marketing and
                explain the available route for bringing the asset to market.
              </p>

              <p className="mt-4 text-lg leading-8 text-gray-700">
                Our equipment experience includes construction machinery,
                earthmoving equipment, mining equipment, agricultural machinery,
                cranes, crushing and screening equipment, compressors,
                industrial machinery and other commercial assets.
              </p>

              <div className="mt-8">
                <Link
                  href="/contact"
                  className="inline-block rounded-xl bg-[#0B2F24] px-7 py-4 font-bold text-white transition hover:bg-[#123d30]"
                >
                  Contact NEWTA About a Machinery Auction
                </Link>
              </div>
            </div>

            <div className="rounded-3xl bg-[#0B2F24] p-8 text-white shadow-xl md:p-10">
              <h3 className="text-2xl font-bold text-[#D4AF37]">
                Plant & Machinery
              </h3>

              <ul className="mt-6 space-y-4 text-lg text-gray-200">
                <li>• Excavators and earthmoving equipment</li>
                <li>• TLBs and loaders</li>
                <li>• Motor graders</li>
                <li>• Crushing and screening equipment</li>
                <li>• Cranes and lifting equipment</li>
                <li>• Mining equipment</li>
                <li>• Agricultural machinery</li>
                <li>• Drilling rigs</li>
                <li>• Compressors</li>
                <li>• Other industrial machinery</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="bg-[#FAF8F2] py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center">
            <span className="text-sm font-bold uppercase tracking-widest text-[#D4AF37]">
              The Process
            </span>

            <h2 className="mt-3 text-3xl font-extrabold text-[#0B2F24] md:text-4xl">
              How the Online Machinery Auction Process Works
            </h2>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-4">
            <div className="rounded-2xl border bg-white p-7">
              <div className="text-3xl font-black text-[#D4AF37]">01</div>

              <h3 className="mt-4 text-xl font-bold text-[#0B2F24]">
                Contact NEWTA
              </h3>

              <p className="mt-3 leading-7 text-gray-600">
                Tell us about the machinery or equipment you would like to
                sell and discuss the available options.
              </p>
            </div>

            <div className="rounded-2xl border bg-white p-7">
              <div className="text-3xl font-black text-[#D4AF37]">02</div>

              <h3 className="mt-4 text-xl font-bold text-[#0B2F24]">
                Asset Information
              </h3>

              <p className="mt-3 leading-7 text-gray-600">
                We gather the relevant specifications, condition information,
                images and other details required to market the equipment.
              </p>
            </div>

            <div className="rounded-2xl border bg-white p-7">
              <div className="text-3xl font-black text-[#D4AF37]">03</div>

              <h3 className="mt-4 text-xl font-bold text-[#0B2F24]">
                Online Auction
              </h3>

              <p className="mt-3 leading-7 text-gray-600">
                The machinery is presented through the relevant external
                online auction platform to registered buyers.
              </p>
            </div>

            <div className="rounded-2xl border bg-white p-7">
              <div className="text-3xl font-black text-[#D4AF37]">04</div>

              <h3 className="mt-4 text-xl font-bold text-[#0B2F24]">
                Sale
              </h3>

              <p className="mt-3 leading-7 text-gray-600">
                The auction process is completed through the relevant
                external auction platform, subject to its terms and conditions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* MACHINERY AUCTIONS */}
      <section
        id="machinery-auctions"
        className="bg-[#0B2F24] py-20 text-white"
      >
        <div className="mx-auto max-w-5xl px-6 text-center">
          <span className="text-sm font-bold uppercase tracking-widest text-[#D4AF37]">
            Machinery Auctions
          </span>

          <h2 className="mt-3 text-3xl font-extrabold md:text-4xl">
            Online Machinery Auctions Through Our External Auction Partner
          </h2>

          <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-gray-300">
            When NEWTA has machinery or equipment going to auction, relevant
            auction information and links can be made available for buyers to
            access through the applicable external online auction platform.
            NEWTA's own website also contains private-treaty equipment listings,
            which are separate from auction listings.
          </p>

          <div className="mt-10 rounded-2xl border border-white/10 bg-white/10 p-8">
            <p className="text-sm font-bold uppercase tracking-wider text-[#D4AF37]">
              Current Machinery Auction
            </p>

            <h3 className="mt-3 text-2xl font-bold">
              No Current Machinery Auction
            </h3>

            <p className="mt-3 text-gray-300">
              There are currently no NEWTA machinery auctions being promoted
              on this page. Check back when the next machinery auction becomes
              available, or contact NEWTA Commercial Sales for information.
            </p>
          </div>

          <div className="mt-8">
            <Link
              href="/online-auctions-south-africa"
              className="inline-block rounded-xl border border-white/30 bg-white/10 px-7 py-4 font-bold text-white transition hover:bg-white/20"
            >
              View All NEWTA Online Auctions
            </Link>
          </div>
        </div>
      </section>

      {/* RELATED CATEGORIES */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center">
            <span className="text-sm font-bold uppercase tracking-widest text-[#D4AF37]">
              Plant & Machinery
            </span>

            <h2 className="mt-3 text-3xl font-extrabold text-[#0B2F24] md:text-4xl">
              Browse Plant & Machinery
            </h2>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Link
              href="/equipment/plant-machinery-for-sale-south-africa"
              className="rounded-xl border bg-[#FAF8F2] p-5 font-bold text-[#0B2F24] transition hover:border-[#D4AF37]"
            >
              Plant & Machinery for Sale →
            </Link>

            <Link
              href="/equipment/construction-equipment-for-sale-south-africa"
              className="rounded-xl border bg-[#FAF8F2] p-5 font-bold text-[#0B2F24] transition hover:border-[#D4AF37]"
            >
              Construction Equipment for Sale →
            </Link>

            <Link
              href="/equipment/mining-equipment-for-sale-south-africa"
              className="rounded-xl border bg-[#FAF8F2] p-5 font-bold text-[#0B2F24] transition hover:border-[#D4AF37]"
            >
              Mining Equipment for Sale →
            </Link>

            <Link
              href="/equipment/agricultural-equipment-for-sale-south-africa"
              className="rounded-xl border bg-[#FAF8F2] p-5 font-bold text-[#0B2F24] transition hover:border-[#D4AF37]"
            >
              Agricultural Equipment for Sale →
            </Link>

            <Link
              href="/equipment/cranes-for-sale-south-africa"
              className="rounded-xl border bg-[#FAF8F2] p-5 font-bold text-[#0B2F24] transition hover:border-[#D4AF37]"
            >
              Cranes for Sale South Africa →
            </Link>

            <Link
              href="/equipment/drilling-rigs-for-sale-south-africa"
              className="rounded-xl border bg-[#FAF8F2] p-5 font-bold text-[#0B2F24] transition hover:border-[#D4AF37]"
            >
              Drilling Rigs for Sale →
            </Link>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="bg-[#FAF8F2] py-20">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h2 className="text-3xl font-extrabold text-[#0B2F24] md:text-4xl">
            Have Plant, Machinery or Equipment to Sell?
          </h2>

          <p className="mt-5 text-lg leading-8 text-gray-700">
            Whether you are considering a private-treaty sale or would like
            to discuss selling your machinery through an online auction,
            contact NEWTA Commercial Sales to discuss your asset and the
            available sales process.
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