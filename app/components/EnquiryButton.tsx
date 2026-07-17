"use client";

import { useState } from "react";
import EnquiryModal from "./EnquiryModal";

type Props = {
  equipmentId: string;
  equipmentTitle: string;
};

export default function EnquiryButton({
  equipmentId,
  equipmentTitle,
}: Props) {
  const [open, setOpen] = useState(false);

 return (
  <>
    <div className="mt-6 rounded-xl bg-red-500 p-6 text-center font-bold text-white">
      TEST BUTTON
    </div>
  
);

      <EnquiryModal
  open={open}
  onClose={() => setOpen(false)}
  equipmentId={equipmentId}
  equipmentTitle={equipmentTitle}
/>
    </>
  );
}