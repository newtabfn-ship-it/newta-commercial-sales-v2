"use client";

import EnquiryForm from "./EnquiryForm";

type Props = {
  open: boolean;
  onClose: () => void;
  equipmentId: string;
  equipmentTitle: string;
};

export default function EnquiryModal({ open, onClose, equipmentId, equipmentTitle }: Props) {
  return (
    <div hidden={!open} className="fixed inset-0 z-[9999]">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div role="dialog" aria-modal="true" aria-labelledby="enquiry-title"
        className="absolute left-1/2 top-1/2 max-h-[90vh] w-full max-w-2xl -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b p-6">
          <h2 id="enquiry-title" className="text-3xl font-bold text-[#0B2F24]">Enquire About This Asset</h2>
          <button onClick={onClose} aria-label="Close enquiry" className="rounded bg-gray-200 px-3 py-2 hover:bg-gray-300">✕</button>
        </div>
        <div className="p-8">
          <EnquiryForm equipment={{ _id: equipmentId, title: equipmentTitle }} />
        </div>
      </div>
    </div>
  );
}
