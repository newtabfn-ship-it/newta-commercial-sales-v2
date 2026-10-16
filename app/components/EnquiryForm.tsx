"use client";

import { useRef, useState } from "react";
import { submitEnquiry } from "@/lib/enquirySubmission";

type Equipment = {
  _id: string;
  title: string;
  referenceNumber?: string;
  status?: string;
};

type Props = {
  equipment: Equipment | null;
};

export default function EnquiryForm({ equipment }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const sending = useRef(false);
  const savedOnce = useRef(false);

  const [form, setForm] = useState({
    name: "",
    company: "",
    phone: "",
    email: "",
    province: "",
    message: "",
  });

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();
    if (sending.current || savedOnce.current || saved) return;
    sending.current = true;
    setLoading(true);
    setError(null);
    try {
      const result = await submitEnquiry({
          equipmentId: equipment?._id,
          equipmentTitle: equipment?.title,
          referenceNumber: equipment?.referenceNumber,
          ...form,
      });
      if (result.saved) {
        savedOnce.current = true;
        setSaved(true);
      } else {
        setError(result.message || "We could not confirm that your enquiry was saved. Please try again shortly.");
      }
    } finally {
      sending.current = false;
      setLoading(false);
    }
  }

  if (saved) return <p role="status" className="rounded-xl border border-green-700 bg-green-50 p-6 text-green-900">
    Your enquiry has been saved. Thank you — a NEWTA consultant will contact you.
  </p>;

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6"
    >
      <fieldset disabled={loading} className="space-y-6">
      {/* Full Name */}

      <div>
        <label className="mb-2 block font-semibold">
          Full Name *
        </label>

        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          className="w-full rounded-lg border p-3"
          required
        />
      </div>

      {/* Company */}

      <div>
        <label className="mb-2 block font-semibold">
          Company
        </label>

        <input
          name="company"
          value={form.company}
          onChange={handleChange}
          className="w-full rounded-lg border p-3"
        />
      </div>

      {/* Phone */}

      <div>
        <label className="mb-2 block font-semibold">
          Cell Number *
        </label>

        <input
          name="phone"
          value={form.phone}
          onChange={handleChange}
          className="w-full rounded-lg border p-3"
          required
        />
      </div>

      {/* Email */}

      <div>
        <label className="mb-2 block font-semibold">
          Email Address *
        </label>

        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          className="w-full rounded-lg border p-3"
          required
        />
      </div>

      {/* Province */}

      <div>
        <label className="mb-2 block font-semibold">
          Province
        </label>

        <input
          name="province"
          value={form.province}
          onChange={handleChange}
          className="w-full rounded-lg border p-3"
        />
      </div>

      {/* Equipment */}

      <div>
        <label className="mb-2 block font-semibold">
          Equipment
        </label>

        <div className="rounded-xl border bg-[#FAF8F2] p-5">
          {equipment ? (
            <>
              <h3 className="text-xl font-bold text-[#0B2F24]">
                {equipment.title}
              </h3>

              {equipment.referenceNumber && <p className="mt-2 text-gray-600">
                Reference: {equipment.referenceNumber}
              </p>}

              {equipment.status && <span
                className={`mt-4 inline-block rounded-full px-3 py-1 text-xs font-bold text-white ${
                  equipment.status === "Available"
                    ? "bg-green-600"
                    : "bg-red-600"
                }`}
              >
                {equipment.status}
              </span>}
            </>
          ) : (
            <p className="text-gray-500">
              General Enquiry
            </p>
          )}
        </div>
      </div>

      {/* Message */}

      <div>
        <label className="mb-2 block font-semibold">
          Message
        </label>

        <textarea
          name="message"
          rows={6}
          value={form.message}
          onChange={handleChange}
          className="w-full rounded-lg border p-3"
        />
      </div>

      {error && <p role="alert" className="rounded-lg border border-amber-700 bg-amber-50 p-4 text-amber-950">{error}</p>}
      <button
        disabled={loading}
        className="w-full rounded-xl bg-[#D4AF37] py-4 text-lg font-bold text-[#0B2F24] hover:opacity-90 disabled:opacity-50"
      >
        {loading ? "Sending..." : "Send Enquiry"}
      </button>
      </fieldset>
    </form>
  );
}
