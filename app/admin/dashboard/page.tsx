import AdminLayout from "../components/AdminLayout";
import StatCard from "../components/StatCard";

export default function DashboardPage() {
  return (
    <AdminLayout
      title="Dashboard"
      subtitle="Welcome back to NEWTA Commercial Sales"
    >
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
    </AdminLayout>
  );
}