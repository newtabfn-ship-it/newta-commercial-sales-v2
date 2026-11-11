import { redirect } from "next/navigation";

import { requireEnquiryAdmin } from "@/lib/requireEnquiryAdmin";
import Enquiry from "@/models/Enquiry";
import Equipment from "@/models/Equipment";

import StatCard from "../../components/StatCard";

export default async function DashboardPage() {
  const denied = await requireEnquiryAdmin();
  if (denied?.status === 401) redirect("/admin/login");
  if (denied) {
    return (
      <p role="alert">
        {denied.status === 403
          ? "An active administrator account is required to view statistics."
          : "Unable to verify access to dashboard statistics."}
      </p>
    );
  }

  let counts: [number, number, number] | undefined;
  try {
    counts = await Promise.all([
      Equipment.countDocuments({ status: "Available" }),
      Equipment.countDocuments({ status: "Sold" }),
      Enquiry.countDocuments({}),
    ]);
  } catch {
    console.error("Failed to load admin dashboard statistics.");
  }

  return (
    <>
      <div className="mb-10 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-black text-[#0B2F24]">
            Dashboard
          </h1>

          <p className="mt-2 text-gray-600">
            Welcome back to NEWTA Commercial Sales
          </p>
        </div>

        <div className="rounded-full bg-[#D4AF37] px-6 py-3 font-bold text-[#0B2F24]">
          Administrator
        </div>
      </div>

      {counts ? (
        <div className="grid gap-6 md:grid-cols-3">
          <StatCard title="Available Equipment" value={counts[0]} color="green" />
          <StatCard title="Sold Equipment" value={counts[1]} color="red" />
          <StatCard title="Total Enquiries" value={counts[2]} color="gold" />
        </div>
      ) : (
        <p role="alert">Unable to load dashboard statistics.</p>
      )}
    </>
  );
}