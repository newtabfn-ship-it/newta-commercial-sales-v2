"use client";

import { useEffect, useState } from "react";

import AdminLayout from "../components/AdminLayout";
import PageTitle from "../components/PageTitle";

import EnquiryDrawer from "../components/enquiries/EnquiryDrawer";


type Enquiry = {
  _id: string;
  name: string;
  equipmentTitle: string;
  phone: string;
  email: string;
  status: string;
  createdAt: string;
};

export default function EnquiriesPage() {
    const [drawerOpen, setDrawerOpen] = useState(false);
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [selectedEnquiryId, setSelectedEnquiryId] =
  useState<string | null>(null);

const [selectedEnquiry, setSelectedEnquiry] =
  useState<any>(null);

  async function loadEnquiries() {
    try {
      const response = await fetch("/api/enquiries");
      const data = await response.json();

      setEnquiries(data);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    loadEnquiries();
  }, []);

  async function markAsRead(id: string) {
  try {
    await fetch(`/api/enquiries/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        status: "Read",
      }),
    });

    await loadEnquiries();

    const response = await fetch(`/api/enquiries/${id}`);
    const data = await response.json();

    setSelectedEnquiry(data);

  } catch (error) {
    console.error(error);
  }
}

async function deleteEnquiry(id: string) {
  if (!confirm("Delete this enquiry?")) return;

  try {
    await fetch(`/api/enquiries/${id}`, {
      method: "DELETE",
    });

    setDrawerOpen(false);
    setSelectedEnquiry(null);
    setSelectedEnquiryId(null);

    await loadEnquiries();

  } catch (error) {
    console.error(error);
  }
}

  return (
    <AdminLayout
      title="Enquiries"
      subtitle="Manage customer enquiries."
    >
      <PageTitle
        title="Enquiries"
        description="View and manage customer enquiries."
      />

      <div className="overflow-hidden rounded-xl border bg-white shadow">
        <table className="w-full">
          <thead className="bg-[#0B2F24] text-white">
            <tr>
              <th className="p-4 text-left">Status</th>
              <th className="p-4 text-left">Name</th>
              <th className="p-4 text-left">Equipment</th>
              <th className="p-4 text-left">Phone</th>
              <th className="p-4 text-left">Date</th>
              <th className="p-4 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>
            {enquiries.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="p-10 text-center text-gray-500"
                >
                  No enquiries received.
                </td>
              </tr>
            ) : (
              enquiries.map((enquiry) => (
                <tr
                  key={enquiry._id}
                  className="border-t hover:bg-gray-50"
                >
                  <td className="p-4">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-bold text-white ${
                        enquiry.status === "New"
                          ? "bg-red-600"
                          : "bg-green-600"
                      }`}
                    >
                      {enquiry.status}
                    </span>
                  </td>

                  <td className="p-4">{enquiry.name}</td>

                  <td className="p-4">
                    {enquiry.equipmentTitle || "-"}
                  </td>

                  <td className="p-4">{enquiry.phone}</td>

                  <td className="p-4">
  {new Date(enquiry.createdAt).toLocaleDateString()}
</td>

<td className="p-4">
  <button
  onClick={async () => {
    setSelectedEnquiryId(enquiry._id);

    const response = await fetch(
      `/api/enquiries/${enquiry._id}`
    );

    const data = await response.json();

    setSelectedEnquiry(data);

    setDrawerOpen(true);
  }}
  className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
>
  View
</button>
</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <EnquiryDrawer
  open={drawerOpen}
  enquiry={selectedEnquiry}
  onClose={() => {
    setDrawerOpen(false);
    setSelectedEnquiry(null);
    setSelectedEnquiryId(null);
  }}
  onMarkAsRead={markAsRead}
  onDelete={deleteEnquiry}
/>
    </AdminLayout>
  );
}