type EquipmentDescriptionProps = {
  description: string;
};

export default function EquipmentDescription({
  description,
}: EquipmentDescriptionProps) {
  return (
    <section className="mt-6 overflow-hidden rounded-2xl border-2 border-[#D4AF37] bg-white shadow-lg">

      {/* Header */}
      <div className="bg-[#0B2F24] px-6 py-4">
        <div className="flex items-center gap-3">
          <span className="text-xl">📖</span>

          <div className="border-b border-[#D4AF37]/20" />

          <h2 className="text-xl font-bold text-white">
            Description
          </h2>
        </div>
      </div>

      {/* Body */}
      <div className="px-6 py-6">

        <p className="whitespace-pre-line text-base leading-8 text-gray-700">
          <p className="mb-5 text-sm font-semibold uppercase tracking-wider text-[#D4AF37]">
  Asset Information
</p>
         {description?.trim() || "No description has been provided for this asset."}
        </p>

      </div>

    </section>
  );
}