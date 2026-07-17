type EquipmentRowProps = {
  id: string;
  title: string;
  location: string;
  hours: string;
  status: string;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onToggleSold: (id: string, status: string) => void;
};

export default function EquipmentRow({
  id,
  title,
  location,
  hours,
  status,
  onEdit,
  onDelete,
  onToggleSold,
}: EquipmentRowProps) {
  return (
    <div className="flex items-center justify-between rounded-xl border bg-white p-6 shadow-sm">
      <div>
        <span
          className={`inline-block rounded-full px-3 py-1 text-xs font-bold text-white ${
            status === "Available"
              ? "bg-green-600"
              : "bg-red-600"
          }`}
        >
          {status.toUpperCase()}
        </span>

        <h2 className="mt-3 text-xl font-bold text-[#0B2F24]">
          {title}
        </h2>

        <p className="mt-2 text-gray-500">
          {location} • {hours} Hours
        </p>
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => onEdit(id)}
          className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          Edit
        </button>

        <button
          onClick={() => onToggleSold(id, status)}
          className={`rounded px-4 py-2 text-white ${
            status === "Available"
              ? "bg-orange-500 hover:bg-orange-600"
              : "bg-green-600 hover:bg-green-700"
          }`}
        >
          {status === "Available"
            ? "Mark Sold"
            : "Mark Available"}
        </button>

        <button
          onClick={() => onDelete(id)}
          className="rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700"
        >
          Delete
        </button>
      </div>
    </div>
  );
}