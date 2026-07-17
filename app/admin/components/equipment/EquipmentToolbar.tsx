"use client";

type EquipmentToolbarProps = {
  onAdd: () => void;
};

export default function EquipmentToolbar({
  onAdd,
}: EquipmentToolbarProps) {
  return (
    <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

      <input
        type="text"
        placeholder="Search equipment..."
        className="w-full rounded-lg border border-gray-300 px-4 py-3 md:max-w-md"
      />

      <div className="flex gap-3">

        <select className="rounded-lg border border-gray-300 px-4 py-3">
          <option>All</option>
          <option>Available</option>
          <option>Sold</option>
        </select>

        <button
  onClick={onAdd}
  className="rounded-lg bg-[#D4AF37] px-6 py-3 font-bold text-[#0B2F24] transition hover:opacity-90"
>
  + Add Equipment
</button>

      </div>

    </div>
  );
}