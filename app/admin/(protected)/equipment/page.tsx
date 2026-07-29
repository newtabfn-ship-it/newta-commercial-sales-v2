"use client";

import { useEffect, useState } from "react";

import PageTitle from "../../components/PageTitle";

import EquipmentToolbar from "../../components/equipment/EquipmentToolbar";
import EquipmentTable from "../../components/equipment/EquipmentTable";
import EquipmentDrawer from "../../components/equipment/EquipmentDrawer";

export default function EquipmentPage() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [equipment, setEquipment] = useState<any[]>([]);

  const [selectedEquipmentId, setSelectedEquipmentId] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  async function loadEquipment() {
  try {
    const response = await fetch("/api/equipment");
    const data = await response.json();

    if (Array.isArray(data)) {
      setEquipment(data);
    } else {
      console.error("API Error:", data);
      setEquipment([]);
    }
  } catch (error) {
    console.error(error);
    setEquipment([]);
  }
}

  useEffect(() => {
    loadEquipment();
  }, []);

  async function handleToggleSold(
  id: string,
  currentStatus: string
) {
  try {
    const newStatus =
      currentStatus === "Available"
        ? "Sold"
        : "Available";

    const response = await fetch(`/api/equipment/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        status: newStatus,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to update status.");
    }

    alert(
      newStatus === "Sold"
        ? "Equipment marked as Sold."
        : "Equipment marked as Available."
    );

    loadEquipment();
  } catch (error) {
    console.error(error);
    alert("Unable to update equipment status.");
  }
}

  return (
  <>
    <div className="mb-10 flex items-center justify-between">
      <div>
        <h1 className="text-4xl font-black text-[#0B2F24]">
          Equipment Management
        </h1>

        <p className="mt-2 text-gray-600">
          Manage all NEWTA Commercial Sales equipment.
        </p>
      </div>

      <div className="rounded-full bg-[#D4AF37] px-6 py-3 font-bold text-[#0B2F24]">
        Administrator
      </div>
    </div>

      <PageTitle
        title="Equipment Management"
        description="Search, edit and manage your equipment listings."
      />

      <EquipmentToolbar
  onAdd={() => {
    setIsEditing(false);
    setSelectedEquipmentId(null);
    setDrawerOpen(true);
  }}
/>

   <EquipmentTable
  equipment={equipment}
  onEdit={(id) => {
    setSelectedEquipmentId(id);
    setIsEditing(true);
    setDrawerOpen(true);
  }}
  onDelete={async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this equipment?"
    );

    if (!confirmed) return;

    try {
      const response = await fetch(`/api/equipment/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete equipment.");
      }

      alert("Equipment deleted successfully!");

      loadEquipment();
    } catch (error) {
      console.error(error);
      alert("Unable to delete equipment.");
    }
  }}
  onToggleSold={handleToggleSold}
/>

     <EquipmentDrawer
  open={drawerOpen}
  onClose={() => setDrawerOpen(false)}
  onEquipmentSaved={loadEquipment}
  equipmentId={selectedEquipmentId}
  isEditing={isEditing}
/>
    </>
  );
}