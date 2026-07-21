import Link from "next/link";

type EquipmentSummaryProps = {
  equipmentId: string;
  status: string;
  price: string;
  hours: string;
  location: string;
  year: string;
  manufacturer: string;
};

export default function EquipmentSummary({
  equipmentId,
  status,
  price,
  hours,
  location,
  year,
  manufacturer,
}: EquipmentSummaryProps) {
  const available = status.toLowerCase() === "available";

  return (
    <aside
  className="sticky top-28 overflow-hidden rounded-2xl border-2 border-[#D4AF37] bg-white shadow-xl"
  style={{
    boxShadow: "0 10px 30px rgba(212,175,55,0.15)",
  }}
>

      {/* Header */}
      <div className="border-b-2 border-[#D4AF37] px-5 py-3">
        <h2 className="text-xl font-bold text-[#0B2F24]">
        Asset Overview
      </h2>
      </div>

      {/* Status + Price */}
      <div className="px-5 py-4">

        <span
          className={`inline-flex rounded-full px-4 py-2 text-sm font-bold uppercase tracking-wider shadow-lg ${
  available
    ? "bg-green-600 text-white"
    : "bg-red-600 text-white"
}`}
        >
          {available ? "Available" : "Sold"}
        </span>

        <div className="mt-4">
          <p className="text-xs uppercase tracking-[0.18em] text-gray-500">
            Price
          </p>

         <p className="mt-2 text-5xl font-black text-[#D4AF37] leading-none">
  {price}
</p>

<p className="mt-2 text-sm text-gray-500">
  Private Treaty Sale
</p>
        </div>

      </div>

     <div className="grid grid-cols-2 gap-3 p-5">

  <div className="rounded-xl bg-gray-50 p-4 text-center">
    <div className="text-2xl">📅</div>
    <p className="mt-2 text-xs uppercase text-gray-500">Year</p>
    <p className="font-bold">{year}</p>
  </div>

  <div className="rounded-xl bg-gray-50 p-4 text-center">
    <div className="text-2xl">⏱</div>
    <p className="mt-2 text-xs uppercase text-gray-500">Hours</p>
    <p className="font-bold">{hours}</p>
  </div>

  <div className="rounded-xl bg-gray-50 p-4 text-center">
    <div className="text-2xl">🏭</div>
    <p className="mt-2 text-xs uppercase text-gray-500">Manufacturer</p>
    <p className="font-bold">{manufacturer}</p>
  </div>

  <div className="rounded-xl bg-gray-50 p-4 text-center">
    <div className="text-2xl">📍</div>
    <p className="mt-2 text-xs uppercase text-gray-500">Location</p>
    <p className="font-bold">{location}</p>
  </div>

</div>

<div className="border-t border-gray-200 px-5 pt-5">
  <p className="text-center text-sm text-gray-600">
    Interested in this asset?
  </p>

  <p className="mt-1 text-center text-sm text-gray-500">
    Contact NEWTA Commercial Sales today.
  </p>
</div>

      {/* Buttons */}
      <div className="space-y-2 p-5">

      <Link
  href={`/contact?id=${equipmentId}`}
  className="block rounded-lg bg-[#D4AF37] py-4 text-center text-sm font-bold text-[#0B2F24] transition hover:bg-[#C89B2C]"
>
 ✉️ Send Enquiry
</Link>

        <a
          href="tel:+27610156516"
          className="block rounded-lg border border-[#0B2F24] py-2.5 text-center text-sm font-bold text-[#0B2F24] transition hover:bg-[#0B2F24] hover:text-white"
        >
          📞 Call NEWTA
        </a>

        <a
          href="https://wa.me/27610156516"
          target="_blank"
          rel="noopener noreferrer"
          className="block rounded-lg bg-[#25D366] py-2.5 text-center text-sm font-bold text-white transition hover:bg-[#1EBE57]"
        >
          💬 WhatsApp
        </a>

        <p className="mt-5 text-center text-xs text-gray-500">
  ✔ Private Treaty Sales

  <br />

  ✔ Nationwide Delivery Assistance

  <br />

  ✔ Personal Service Since 2011
</p>

      </div>

    </aside>
  );
}