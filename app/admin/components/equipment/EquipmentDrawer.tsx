import EquipmentForm from "./EquipmentForm";

type EquipmentDrawerProps = {
  open: boolean;
  onClose: () => void;
  onEquipmentSaved: () => void;

  equipmentId: string | null;
  isEditing: boolean;
};

export default function EquipmentDrawer({
  open,
  onClose,
  onEquipmentSaved,
  equipmentId,
  isEditing,
}: EquipmentDrawerProps) {
  return (
    <div
      className={`fixed inset-0 z-50 transition ${
        open ? "visible" : "invisible"
      }`}
    >
      {/* Dark background */}
      <div
        className={`absolute inset-0 bg-black/40 transition-opacity ${
          open ? "opacity-100" : "opacity-0"
        }`}
        onClick={onClose}
      />

      {/* Drawer */}
      <aside
        className={`absolute right-0 top-0 flex h-full w-full max-w-xl flex-col bg-white shadow-2xl transition-transform duration-300 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b p-6">
          <h2 className="text-2xl font-bold text-[#0B2F24]">
  {isEditing ? "Edit Equipment" : "Add Equipment"}
</h2>

          <button
            onClick={onClose}
            className="rounded-lg bg-gray-100 px-3 py-2 hover:bg-gray-200"
          >
            ✕
          </button>
        </div>

        {/* Scrollable Form */}
        <div className="flex-1 overflow-y-auto p-6">
        <EquipmentForm
  equipmentId={equipmentId}
  isEditing={isEditing}
  onSuccess={() => {
    onEquipmentSaved();
    onClose();
  }}
/>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-4 border-t p-6">
          <button
            onClick={onClose}
            className="rounded-lg border border-gray-300 px-6 py-3 font-semibold"
          >
            Cancel
          </button>

          <button
  type="submit"
  form="equipment-form"
  className="rounded-lg bg-[#D4AF37] px-6 py-3 font-bold text-[#0B2F24] hover:opacity-90"
>
 {isEditing ? "Save Changes" : "Save Equipment"}
</button>
        </div>
      </aside>
    </div>
  );
}