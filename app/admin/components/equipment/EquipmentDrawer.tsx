"use client";

import { useState } from "react";
import EquipmentForm from "./EquipmentForm";

type EquipmentDrawerProps = {
  open: boolean;
 isEditing: boolean;
 equipmentId: string | null;

  onClose: () => void;
  onEquipmentSaved: () => Promise<void> | void;
};

export default function EquipmentDrawer({
  open,
  isEditing,
  equipmentId,
  onClose,
  onEquipmentSaved,
}: EquipmentDrawerProps) {
  const [saving, setSaving] = useState(false);

  async function handleSuccess() {
    setSaving(true);

    try {
      await onEquipmentSaved();
      onClose();
    } finally {
      setSaving(false);
    }
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">

      {/* Backdrop */}

      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={!saving ? onClose : undefined}
      />

      {/* Drawer */}

      <aside className="absolute right-0 top-0 flex h-full w-full max-w-2xl flex-col bg-white shadow-2xl">

        {/* Header */}

        <header className="flex items-center justify-between border-b px-8 py-6">

          <div>

            <h2 className="text-2xl font-bold text-[#0B2F24]">
              {isEditing ? "Edit Equipment" : "Add Equipment"}
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              {isEditing
                ? "Update this asset."
                : "Create a new equipment listing."}
            </p>

          </div>

          <button
            disabled={saving}
            onClick={onClose}
            className="rounded-lg border px-4 py-2 hover:bg-gray-100 disabled:opacity-50"
          >
            ✕
          </button>

        </header>

        {/* Form */}

        <main className="flex-1 overflow-y-auto p-8">

          <EquipmentForm
  key={equipmentId ?? "new"}
  equipmentId={equipmentId}
  isEditing={isEditing}
  onSuccess={handleSuccess}
/>

        </main>

        {/* Footer */}

        <footer className="flex items-center justify-between border-t bg-gray-50 px-8 py-6">

          <button
            disabled={saving}
            onClick={onClose}
            className="rounded-lg border border-gray-300 px-6 py-3 font-semibold hover:bg-white disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="submit"
            form="equipment-form"
            disabled={saving}
            className="rounded-lg bg-[#D4AF37] px-8 py-3 font-bold text-[#0B2F24] hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving
              ? "Saving..."
              : isEditing
              ? "Save Changes"
              : "Save Equipment"}
          </button>

        </footer>

      </aside>

    </div>
  );
}