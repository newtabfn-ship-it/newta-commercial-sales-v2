"use client";

type Props = {
  open: boolean;
  onClose: () => void;
  equipmentId: string;
  equipmentTitle: string;
};

export default function EnquiryModal({
  open,
  onClose,
  equipmentId,
  equipmentTitle,
}: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[9999]">

      <div
        className="absolute inset-0 bg-black/60"
        onClick={onClose}
      />

      <div className="absolute left-1/2 top-1/2 w-full max-w-2xl -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white shadow-2xl">

        <div className="flex items-center justify-between border-b p-6">

          <h2 className="text-3xl font-bold text-[#0B2F24]">
            Enquire About This Asset
          </h2>

          <div className="mb-6 rounded-xl bg-[#FAF8F2] p-4">
  <p className="text-sm font-semibold text-gray-500">
    Asset
  </p>

  <p className="mt-1 text-lg font-bold text-[#0B2F24]">
    {equipmentTitle}
  </p>
</div>

          <button
            onClick={onClose}
            className="rounded bg-gray-200 px-3 py-2 hover:bg-gray-300"
          >
            ✕
          </button>

        </div>

        <div className="space-y-6 p-8">

          <div>
            <label className="mb-2 block font-semibold">
              Name
            </label>

            <input
              className="w-full rounded-lg border p-3"
              placeholder="Your name"
            />
          </div>

          <div>
            <label className="mb-2 block font-semibold">
              Cell Number
            </label>

            <input
              className="w-full rounded-lg border p-3"
              placeholder="+27..."
            />
          </div>

          <div>
            <label className="mb-2 block font-semibold">
              Email
            </label>

            <input
              className="w-full rounded-lg border p-3"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="mb-2 block font-semibold">
              Message
            </label>

            <textarea
              rows={5}
              className="w-full rounded-lg border p-3"
              placeholder="I'm interested in this asset..."
            />
          </div>

          <button
            className="w-full rounded-xl bg-[#D4AF37] py-4 text-lg font-bold text-[#0B2F24] hover:opacity-90"
          >
            Send Enquiry
          </button>

        </div>

      </div>

    </div>
  );
}