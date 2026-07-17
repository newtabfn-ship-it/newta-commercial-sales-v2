type StatCardProps = {
  title: string;
  value: number;
  color: "green" | "red" | "gold";
};

export default function StatCard({
  title,
  value,
  color,
}: StatCardProps) {
  const textColor =
    color === "green"
      ? "text-green-600"
      : color === "red"
      ? "text-red-600"
      : "text-[#D4AF37]";

  return (
    <div className="rounded-xl bg-white p-8 shadow">
      <h2 className="text-gray-500">{title}</h2>

      <p className={`mt-3 text-5xl font-bold ${textColor}`}>
        {value}
      </p>
    </div>
  );
}