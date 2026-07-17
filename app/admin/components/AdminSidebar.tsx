import Link from "next/link";

export default function AdminSidebar() {
  return (
    <aside className="flex h-screen w-72 flex-col bg-[#0B2F24] text-white">

      <div className="border-b border-[#D4AF37]/30 p-8">

        <h1 className="text-3xl font-extrabold text-white">
          NEWTA
        </h1>

        <p className="mt-1 text-sm uppercase tracking-[4px] text-[#D4AF37]">
          ADMIN
        </p>

      </div>

      <nav className="flex-1 space-y-2 p-6">

        <Link
          href="/admin/dashboard"
          className="block rounded-lg px-4 py-3 transition hover:bg-[#D4AF37] hover:text-[#0B2F24]"
        >
          📊 Dashboard
        </Link>

        <Link
          href="/admin/equipment"
          className="block rounded-lg px-4 py-3 transition hover:bg-[#D4AF37] hover:text-[#0B2F24]"
        >
          🚜 Equipment
        </Link>

        <Link
          href="/admin/enquiries"
          className="block rounded-lg px-4 py-3 transition hover:bg-[#D4AF37] hover:text-[#0B2F24]"
        >
          📩 Enquiries
        </Link>

        <Link
          href="/admin/settings"
          className="block rounded-lg px-4 py-3 transition hover:bg-[#D4AF37] hover:text-[#0B2F24]"
        >
          ⚙️ Settings
        </Link>

      </nav>

      <div className="border-t border-[#D4AF37]/30 p-6">

        <button className="w-full rounded-lg bg-[#D4AF37] py-3 font-bold text-[#0B2F24]">
          Logout
        </button>

      </div>

    </aside>
  );
}