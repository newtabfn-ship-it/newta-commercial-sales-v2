type AdminHeaderProps = {
  title: string;
  subtitle: string;
};

export default function AdminHeader({
  title,
  subtitle,
}: AdminHeaderProps) {
  return (
    <header className="flex items-center justify-between border-b bg-white px-8 py-6 shadow-sm">

      <div>
        <h1 className="text-3xl font-bold text-[#0B2F24]">
          {title}
        </h1>

        <p className="mt-1 text-gray-500">
          {subtitle}
        </p>
      </div>

      <div className="rounded-full bg-[#D4AF37] px-5 py-2 font-semibold text-[#0B2F24]">
        Administrator
      </div>

    </header>
  );
}