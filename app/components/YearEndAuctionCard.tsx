import Link from "next/link";

export default function YearEndAuctionCard({
  secondaryHref,
  secondaryLabel,
}: {
  secondaryHref: string;
  secondaryLabel: string;
}) {
  const details = [
    ["Auction Starts", "16 November 2026 at 09:00 SAST"],
    ["Auction Closes", "24 November 2026 from 11:00 SAST"],
    ["Location", "Free State and Northern Cape, South Africa"],
    ["Auction Type", "Timed Online Auction"],
  ];

  return (
    <div className="mt-10 rounded-2xl border border-[#D4AF37]/40 bg-white/10 p-8 text-left">
      <p className="text-sm font-bold uppercase tracking-wider text-[#D4AF37]">
        Upcoming Auction
      </p>
      <h3 className="mt-3 text-2xl font-bold md:text-3xl">
        Year-End Mega Asset Clearance Auction
      </h3>
      <p className="mt-4 text-lg leading-8 text-gray-300">
        Browse trucks, trailers, construction and mining machinery, agricultural
        equipment and other commercial assets on BidPro.
      </p>
      <dl className="mt-6 grid gap-4 sm:grid-cols-2">
        {details.map(([label, value]) => (
          <div key={label} className="rounded-xl bg-white/10 p-4">
            <dt className="text-sm font-bold uppercase tracking-wider text-[#D4AF37]">
              {label}
            </dt>
            <dd className="mt-1 font-semibold text-white">{value}</dd>
          </div>
        ))}
      </dl>
      <div className="mt-8 flex flex-wrap gap-4">
        <a
          href="https://www.bidpro.co.za/AuctionDetails/1618"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block rounded-xl bg-[#D4AF37] px-7 py-4 font-bold text-[#0B2F24] transition hover:opacity-90"
        >
          View Auction on BidPro →
        </a>
        <Link
          href={secondaryHref}
          className="inline-block rounded-xl border border-white/30 bg-white/10 px-7 py-4 font-bold text-white transition hover:bg-white/20"
        >
          {secondaryLabel}
        </Link>
      </div>
    </div>
  );
}
