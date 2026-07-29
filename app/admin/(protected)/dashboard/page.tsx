import StatCard from "../../components/StatCard";

export default function DashboardPage() {
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

      <div className="grid gap-6 md:grid-cols-3">
        <StatCard
          title="Available Equipment"
          value={0}
          color="green"
        />

        <StatCard
          title="Sold Equipment"
          value={0}
          color="red"
        />

        <StatCard
          title="Enquiries"
          value={0}
          color="gold"
        />
      </div>
    </>
  );
}