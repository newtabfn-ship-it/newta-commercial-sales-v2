type EquipmentDescriptionProps = {
  description: string;
};

export default function EquipmentDescription({
  description,
}: EquipmentDescriptionProps) {
  return (
    <section className="mt-6 overflow-hidden rounded-2xl border-2 border-[#D4AF37] bg-white shadow-lg">

      {/* Header */}
      <div className="bg-[#0B2F24] px-5 py-3">
        <div className="flex items-center gap-3">
          <span className="text-xl">📖</span>

          <h2 className="text-lg font-bold text-white">
            Description
          </h2>
        </div>
      </div>

      {/* Body */}
      <div className="px-5 py-5">

        <p className="text-sm leading-7 text-gray-700 whitespace-pre-line">
          {description}
        </p>

      </div>

    </section>
  );
}