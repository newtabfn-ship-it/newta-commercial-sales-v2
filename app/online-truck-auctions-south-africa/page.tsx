import type { Metadata } from "next";
import Link from "next/link";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export const metadata: Metadata = {
  title:
    "Online Truck Auctions South Africa | Commercial Truck Auctions | NEWTA Commercial Sales",
  description:
    "Online truck auctions in South Africa for commercial trucks, truck tractors, crane trucks, concrete mixer trucks, fleet vehicles and trailers. NEWTA Commercial Sales assists with preparing and marketing commercial vehicles for online auction.",
  keywords: [
    "online truck auctions South Africa",
    "truck auctions South Africa",
    "online auctions for trucks South Africa",
    "commercial truck auctions South Africa",
    "commercial vehicle auctions South Africa",
    "online commercial vehicle auctions South Africa",
    "used truck auctions South Africa",
    "truck tractor auctions South Africa",
    "trailer auctions South Africa",
    "crane truck auctions South Africa",
    "concrete mixer truck auctions South Africa",
    "fleet truck auctions South Africa",
    "online vehicle auctions South Africa",
    "NEWTA Commercial Sales",
  ],
  alternates: {
    canonical:
      "https://newtacommercialsales.com/online-truck-auctions-south-africa",
  },
  openGraph: {
    title:
      "Online Truck Auctions South Africa | Commercial Truck Auctions | NEWTA Commercial Sales",
    description:
      "Online truck auctions in South Africa for commercial trucks, truck tractors, crane trucks, concrete mixer trucks, fleet vehicles and trailers through NEWTA Commercial Sales.",
    url: "https://newtacommercialsales.com/online-truck-auctions-south-africa",
    siteName: "NEWTA Commercial Sales",
    locale: "en_ZA",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function OnlineTruckAuctionsSouthAfricaPage() {
  return (
    <>
      <Navbar />

      {/* HERO */}
      <section className="bg-[#0B2F24] pt-44 pb-20 text-white">
        <div className="mx-auto max-w-7xl px-6">
          <span className="inline-block rounded-full bg-[#D4AF37] px-5 py-2 text-sm font-bold uppercase tracking-wider text-[#0B2F24]">
            Online Truck Auctions
          </span>

          <h1 className="mt-7 max-w-5xl text-4xl font-extrabold leading-tight md:text-6xl">
            Online Truck Auctions South Africa
          </h1>

          <p className="mt-6 max-w-3xl text-xl leading-8 text-gray-300">
            NEWTA Commercial Sales assists with the sale of commercial trucks,
            truck tractors, crane trucks, concrete mixer trucks, fleet
            vehicles, trailers and other commercial vehicles through online
            auctions in South Africa.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="#sell-by-auction"
              className="rounded-xl bg-[#D4AF37] px-7 py-4 font-bold text-[#0B2F24] transition hover:opacity-90"
            >
              Sell Your Truck by Auction
            </Link>

            <Link
              href="#truck-auctions"
              className="rounded-xl border border-white/30 bg-white/10 px-7 py-4 font-bold text-white transition hover:bg-white/20"
            >
              Truck Auction Information
            </Link>
          </div>
        </div>
      </section>

      {/* INTRO */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-5xl px-6">
          <h2 className="text-3xl font-extrabold text-[#0B2F24] md:text-4xl">
            Online Truck Auctions South Africa
          </h2>

          <div className="mt-6 space-y-5 text-lg leading-8 text-gray-700">
            <p>
              NEWTA Commercial Sales assists businesses, companies, fleet
              owners and asset owners with the preparation and marketing of
              trucks and commercial vehicles for online auctions in South Africa.
              Online auctions are separate from NEWTA's private-treaty sales.
            </p>

            <p>
              Online truck auctions can provide access to registered buyers
              and may be suitable where competitive bidding forms part of the
              proposed sales process. NEWTA can assist with gathering vehicle
              information, specifications, images and other details required
              to market commercial vehicles for online auction.
            </p>

            <p>
              Commercial vehicles that may be considered for online auction
              include truck tractors, rigid trucks, crane trucks, concrete mixer
              trucks, water tankers, vacuum and honey sucker trucks, fleet
              vehicles, bakkies, trailers and other commercial vehicles.
            </p>

            <p>
              If you are looking for truck auctions in South Africa or
              considering selling a commercial truck through an online auction,
              contact NEWTA Commercial Sales to discuss the asset and available
              selling options. NEWTA also offers private-treaty sales for
              commercial vehicles where that sales method is appropriate.
            </p>
          </div>
        </div>
      </section>

      {/* TRUCK TYPES */}
      <section className="bg-[#FAF8F2] py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center">
            <span className="text-sm font-bold uppercase tracking-widest text-[#D4AF37]">
              Commercial Vehicles
            </span>

            <h2 className="mt-3 text-3xl font-extrabold text-[#0B2F24] md:text-4xl">
              Commercial Trucks That May Be Offered Through Online Auction
            </h2>

            <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-gray-700">
              NEWTA works with a wide range of commercial vehicles and trucks.
              Depending on the asset, seller requirements and proposed sales
              process, these vehicles may be considered for online auction.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-2xl bg-white p-7 shadow-lg">
              <h3 className="text-xl font-bold text-[#0B2F24]">
                Truck Tractors
              </h3>
              <p className="mt-3 leading-7 text-gray-600">
                Truck tractors and prime movers used for long-distance and
                heavy commercial transport.
              </p>
            </div>

            <div className="rounded-2xl bg-white p-7 shadow-lg">
              <h3 className="text-xl font-bold text-[#0B2F24]">
                Crane Trucks
              </h3>
              <p className="mt-3 leading-7 text-gray-600">
                Crane trucks and commercial vehicles fitted with lifting
                equipment for construction, industrial and material-handling
                applications.
              </p>
            </div>

            <div className="rounded-2xl bg-white p-7 shadow-lg">
              <h3 className="text-xl font-bold text-[#0B2F24]">
                Concrete Mixer Trucks
              </h3>
              <p className="mt-3 leading-7 text-gray-600">
                Concrete mixer trucks and specialised vehicles used for
                transporting and mixing concrete.
              </p>
            </div>

            <div className="rounded-2xl bg-white p-7 shadow-lg">
              <h3 className="text-xl font-bold text-[#0B2F24]">
                Water Tanker Trucks
              </h3>
              <p className="mt-3 leading-7 text-gray-600">
                Water tankers and other liquid-carrying commercial trucks for
                industrial, construction and general applications.
              </p>
            </div>

            <div className="rounded-2xl bg-white p-7 shadow-lg">
              <h3 className="text-xl font-bold text-[#0B2F24]">
                Vacuum & Honey Sucker Trucks
              </h3>
              <p className="mt-3 leading-7 text-gray-600">
                Specialist vacuum trucks and honey sucker vehicles used for
                liquid waste and related commercial applications.
              </p>
            </div>

            <div className="rounded-2xl bg-white p-7 shadow-lg">
              <h3 className="text-xl font-bold text-[#0B2F24]">
                Fleet & Other Trucks
              </h3>
              <p className="mt-3 leading-7 text-gray-600">
                Fleet disposal trucks, rigid trucks, bakkies and other
                commercial vehicles may also be suitable for online auction.
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
                Selling a Truck?
              </span>

              <h2 className="mt-3 text-3xl font-extrabold text-[#0B2F24] md:text-5xl">
                Want to Sell Your Truck Through an Online Auction?
              </h2>

              <p className="mt-6 text-lg leading-8 text-gray-700">
                If you have a truck, fleet vehicle or commercial vehicle that
                you would like to sell through an online auction, contact
                NEWTA Commercial Sales to discuss the asset and available
                sales options.
              </p>

              <p className="mt-4 text-lg leading-8 text-gray-700">
                We can discuss the vehicle with you, gather the relevant
                specifications and information, assist with marketing and
                explain the available route for bringing the truck to market.
              </p>

              <p className="mt-4 text-lg leading-8 text-gray-700">
                Our commercial vehicle experience includes trucks, truck
                tractors, trailers, crane trucks, concrete mixer trucks,
                tankers, specialist vehicles and other commercial assets.
              </p>

              <div className="mt-8">
                <Link
                  href="/contact"
                  className="inline-block rounded-xl bg-[#0B2F24] px-7 py-4 font-bold text-white transition hover:bg-[#123d30]"
                >
                  Contact NEWTA About a Truck Auction
                </Link>
              </div>
            </div>

            <div className="rounded-3xl bg-[#0B2F24] p-8 text-white shadow-xl md:p-10">
              <h3 className="text-2xl font-bold text-[#D4AF37]">
                Commercial Vehicles
              </h3>

              <ul className="mt-6 space-y-4 text-lg text-gray-200">
                <li>• Truck tractors and prime movers</li>
                <li>• Rigid trucks</li>
                <li>• Crane trucks</li>
                <li>• Concrete mixer trucks</li>
                <li>• Water tanker trucks</li>
                <li>• Vacuum and honey sucker trucks</li>
                <li>• Fleet vehicles</li>
                <li>• Bakkies and pickups</li>
                <li>• Trailers</li>
                <li>• Other commercial vehicles</li>
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
              How the Online Truck Auction Process Works
            </h2>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-4">
            <div className="rounded-2xl border bg-white p-7">
              <div className="text-3xl font-black text-[#D4AF37]">01</div>

              <h3 className="mt-4 text-xl font-bold text-[#0B2F24]">
                Contact NEWTA
              </h3>

              <p className="mt-3 leading-7 text-gray-600">
                Tell us about the truck or commercial vehicle you would like
                to sell and discuss the available options.
              </p>
            </div>

            <div className="rounded-2xl border bg-white p-7">
              <div className="text-3xl font-black text-[#D4AF37]">02</div>

              <h3 className="mt-4 text-xl font-bold text-[#0B2F24]">
                Truck Information
              </h3>

              <p className="mt-3 leading-7 text-gray-600">
                We gather the relevant specifications, condition information,
                images and other details required to market the vehicle.
              </p>
            </div>

            <div className="rounded-2xl border bg-white p-7">
              <div className="text-3xl font-black text-[#D4AF37]">03</div>

              <h3 className="mt-4 text-xl font-bold text-[#0B2F24]">
                Online Auction
              </h3>

              <p className="mt-3 leading-7 text-gray-600">
                The truck is presented through the relevant external
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

      {/* TRUCK AUCTIONS */}
      <section
        id="truck-auctions"
        className="bg-[#0B2F24] py-20 text-white"
      >
        <div className="mx-auto max-w-5xl px-6 text-center">
          <span className="text-sm font-bold uppercase tracking-widest text-[#D4AF37]">
            Truck Auctions
          </span>

          <h2 className="mt-3 text-3xl font-extrabold md:text-4xl">
            Online Truck Auctions Through Our External Auction Partner
          </h2>

          <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-gray-300">
            When NEWTA has trucks or commercial vehicles going to auction,
            relevant auction information and links can be made available for
            buyers to access through the applicable external online auction
            platform. NEWTA's private-treaty listings are separate from
            auction listings.
          </p>

         <div className="mt-10 rounded-2xl border border-[#D4AF37]/40 bg-white/10 p-8 text-left">
  <p className="text-sm font-bold uppercase tracking-wider text-[#D4AF37]">
    Upcoming Truck Auction
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
      The auction is conducted through our external online auction partner.
      Buyers can view the auction details, register and participate through
      the BidPro auction platform.
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
      href="/online-auctions-south-africa"
      className="inline-block rounded-xl border border-white/30 bg-white/10 px-7 py-4 font-bold text-white transition hover:bg-white/20"
    >
      View All NEWTA Online Auctions
    </Link>
  </div>
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
              Commercial Vehicles
            </span>

            <h2 className="mt-3 text-3xl font-extrabold text-[#0B2F24] md:text-4xl">
              Browse Commercial Trucks & Vehicles
            </h2>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Link
              href="/equipment/trucks-for-sale-south-africa"
              className="rounded-xl border bg-[#FAF8F2] p-5 font-bold text-[#0B2F24] transition hover:border-[#D4AF37]"
            >
              Trucks for Sale South Africa →
            </Link>

            <Link
              href="/equipment/truck-tractors-for-sale-south-africa"
              className="rounded-xl border bg-[#FAF8F2] p-5 font-bold text-[#0B2F24] transition hover:border-[#D4AF37]"
            >
              Truck Tractors for Sale South Africa →
            </Link>

            <Link
              href="/equipment/crane-trucks-for-sale-south-africa"
              className="rounded-xl border bg-[#FAF8F2] p-5 font-bold text-[#0B2F24] transition hover:border-[#D4AF37]"
            >
              Crane Trucks for Sale South Africa →
            </Link>

            <Link
              href="/equipment/cement-mixer-trucks-for-sale-south-africa"
              className="rounded-xl border bg-[#FAF8F2] p-5 font-bold text-[#0B2F24] transition hover:border-[#D4AF37]"
            >
              Cement Mixer Trucks for Sale →
            </Link>

            <Link
              href="/equipment/trailers-for-sale-south-africa"
              className="rounded-xl border bg-[#FAF8F2] p-5 font-bold text-[#0B2F24] transition hover:border-[#D4AF37]"
            >
              Trailers for Sale South Africa →
            </Link>

            <Link
              href="/equipment/bakkies-for-sale-south-africa"
              className="rounded-xl border bg-[#FAF8F2] p-5 font-bold text-[#0B2F24] transition hover:border-[#D4AF37]"
            >
              Bakkies for Sale South Africa →
            </Link>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="bg-[#FAF8F2] py-20">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h2 className="text-3xl font-extrabold text-[#0B2F24] md:text-4xl">
            Have a Truck or Commercial Vehicle to Sell?
          </h2>

          <p className="mt-5 text-lg leading-8 text-gray-700">
            Whether you are considering a private-treaty sale or would like
            to discuss selling your truck through an online auction, contact
            NEWTA Commercial Sales to discuss the asset and available sales
            process.
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