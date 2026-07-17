"use client";

import EquipmentRow from "./EquipmentRow";

type Equipment = {
  _id: string;
  title: string;
  province: string;
  kmHours: string;
  status: string;
};

type EquipmentTableProps = {
  equipment: Equipment[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onToggleSold: (id: string, status: string) => void;
};

export default function EquipmentTable({
  equipment,
  onEdit,
  onDelete,
  onToggleSold,
}: EquipmentTableProps) {
  return (
    <div className="space-y-4">
      {equipment.map((item) => (
        <EquipmentRow
          key={item._id}
          id={item._id}
          title={item.title}
          location={item.province || "-"}
          hours={item.kmHours || "-"}
          status={item.status}
          onEdit={onEdit}
          onDelete={onDelete}
          onToggleSold={onToggleSold}
        />
      ))}
    </div>
  );
}