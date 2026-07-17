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
        <h2 className="text-lg font-bold text-[#0B2F24]">
          Equipment Summary
        </h2>
      </div>

      {/* Status + Price */}
      <div className="px-5 py-4">

        <span
          className={`inline-flex rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider text-white ${
            available ? "bg-green-600" : "bg-red-600"
          }`}
        >
          {available ? "Available" : "Sold"}
        </span>

        <div className="mt-4">
          <p className="text-xs uppercase tracking-[0.18em] text-gray-500">
            Price
          </p>

          <p className="mt-1 text-3xl font-extrabold text-[#D4AF37]">
            {price}
          </p>
        </div>

      </div>

      {/* Compact Details */}
      <div className="border-y border-gray-200 px-5 py-4">

        <div className="grid grid-cols-[110px_1fr] gap-y-3 text-sm">

          <span className="text-gray-500">Hours</span>
          <span className="font-semibold text-right">{hours}</span>

          <span className="text-gray-500">Year</span>
          <span className="font-semibold text-right">{year}</span>

          <span className="text-gray-500">Manufacturer</span>
          <span className="font-semibold text-right">{manufacturer}</span>

          <span className="text-gray-500">Location</span>
          <span className="font-semibold text-right">{location}</span>

        </div>

      </div>

      {/* Buttons */}
      <div className="space-y-2 p-5">

      <Link
  href={`/contact?id=${equipmentId}`}
  className="block rounded-lg bg-[#D4AF37] py-2.5 text-center text-sm font-bold text-[#0B2F24] transition hover:bg-[#C89B2C]"
>
  Enquire About Equipment
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

      </div>

    </aside>
  );
}