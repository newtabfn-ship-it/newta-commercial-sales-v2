import AdminHeader from "./AdminHeader";
import AdminSidebar from "./AdminSidebar";

type Props = {
  title: string;
  subtitle: string;
  children: React.ReactNode;
};

export default function AdminLayout({
  title,
  subtitle,
  children,
}: Props) {
  return (
    <div className="flex min-h-screen">

      <AdminSidebar />

      <div className="flex flex-1 flex-col bg-[#F5F5F5]">

        <AdminHeader
          title={title}
          subtitle={subtitle}
        />

        <main className="flex-1 p-8">
          {children}
        </main>

      </div>

    </div>
  );
}