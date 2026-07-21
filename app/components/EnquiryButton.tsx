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
    <button
      onClick={() => setOpen(true)}
      className="mt-6 w-full rounded-xl bg-[#D4AF37] py-4 text-lg font-bold text-[#0B2F24] shadow-xl transition duration-300 hover:-translate-y-0.5 hover:bg-[#C89B2C] hover:shadow-2xl"
    >
      ✉️ Send Enquiry
    </button>

    <EnquiryModal
      open={open}
      onClose={() => setOpen(false)}
      equipmentId={equipmentId}
      equipmentTitle={equipmentTitle}
    />
  </>
);
}