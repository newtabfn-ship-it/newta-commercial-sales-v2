"use client";

type Enquiry = {
  _id: string;
  name: string;
  company?: string;
  phone: string;
  email: string;
  province?: string;
  equipmentTitle?: string;
  message?: string;
  status: string;
  createdAt: string;
};

type Props = {
  open: boolean;
  enquiry: Enquiry | null;
  onClose: () => void;
  onMarkAsRead: (id: string) => void;
  onDelete: (id: string) => void;
};

export default function EnquiryDrawer({
  open,
  enquiry,
  onClose,
  onMarkAsRead,
  onDelete,
}: Props) {
  if (!enquiry) return null;

  return (
    <div
      className={`fixed inset-0 z-50 transition ${
        open ? "visible" : "invisible"
      }`}
    >
      {/* Background */}

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
            Enquiry Details
          </h2>

          <button
            onClick={onClose}
            className="rounded-lg bg-gray-100 px-3 py-2 hover:bg-gray-200"
          >
            ✕
          </button>
        </div>

        {/* Body */}

        <div className="flex-1 space-y-6 overflow-y-auto p-6">

          <div>
            <p className="text-sm font-semibold text-gray-500">
              Status
            </p>

            <span
              className={`mt-2 inline-block rounded-full px-4 py-2 text-sm font-bold text-white ${
                enquiry.status === "New"
                  ? "bg-red-600"
                  : "bg-green-600"
              }`}
            >
              {enquiry.status}
            </span>
          </div>

          <div>
            <p className="text-sm font-semibold text-gray-500">
              Name
            </p>

            <p className="text-lg font-semibold">
              {enquiry.name}
            </p>
          </div>

          <div>
            <p className="text-sm font-semibold text-gray-500">
              Company
            </p>

            <p>
              {enquiry.company || "-"}
            </p>
          </div>

          <div>
            <p className="text-sm font-semibold text-gray-500">
              Phone
            </p>

            <p>{enquiry.phone}</p>
          </div>

          <div>
            <p className="text-sm font-semibold text-gray-500">
              Email
            </p>

            <p>{enquiry.email}</p>
          </div>

          <div>
            <p className="text-sm font-semibold text-gray-500">
              Province
            </p>

            <p>{enquiry.province || "-"}</p>
          </div>

          <div>
            <p className="text-sm font-semibold text-gray-500">
              Equipment
            </p>

            <p>{enquiry.equipmentTitle || "-"}</p>
          </div>

          <div>
            <p className="text-sm font-semibold text-gray-500">
              Message
            </p>

            <div className="rounded-lg bg-gray-50 p-4">
              {enquiry.message || "No message supplied."}
            </div>
          </div>

          <div>
            <p className="text-sm font-semibold text-gray-500">
              Received
            </p>

            <p>
              {new Date(enquiry.createdAt).toLocaleString()}
            </p>
          </div>

        </div>

        {/* Footer */}

        <div className="flex justify-end gap-3 border-t p-6">

          <button
  onClick={() => onMarkAsRead(enquiry._id)}
  className="rounded-lg bg-green-600 px-5 py-3 font-semibold text-white hover:bg-green-700"
>
  Mark as Read
</button>

<button
  onClick={() => onDelete(enquiry._id)}
  className="rounded-lg bg-red-600 px-5 py-3 font-semibold text-white hover:bg-red-700"
>
  Delete
</button>

          <button
            onClick={onClose}
            className="rounded-lg border border-gray-300 px-5 py-3 font-semibold"
          >
            Close
          </button>

        </div>

      </aside>
    </div>
  );
}