type EquipmentSpecificationsProps = {
  manufacturer: string;
  model: string;
  year: string;
  hours: string;
  engine: string;
  power: string;
  operatingWeight: string;
  bucket: string;
  fuel: string;
  drive: string;
  serialNumber: string;
};

export default function EquipmentSpecifications({
  manufacturer,
  model,
  year,
  hours,
  engine,
  power,
  operatingWeight,
  bucket,
  fuel,
  drive,
  serialNumber,
}: EquipmentSpecificationsProps) {
  const specifications = [
    ["Manufacturer", manufacturer],
    ["Model", model],
    ["Year", year],
    ["Hours", hours],
    ["Engine", engine],
    ["Power", power],
    ["Operating Weight", operatingWeight],
    ["Bucket", bucket],
    ["Fuel", fuel],
    ["Drive", drive],
    ["Serial Number", serialNumber],
  ];

  return (
    <section className="mt-6 overflow-hidden rounded-2xl border-2 border-[#D4AF37] bg-white shadow-lg">

      {/* Header */}
      <div className="bg-[#0B2F24] px-5 py-3">
        <div className="flex items-center gap-3">
          <span className="text-xl">⚙️</span>

          <h2 className="text-lg font-bold text-white">
            Technical Specifications
          </h2>
        </div>
      </div>

      {/* Specification Table */}
      <div>

        {specifications.map(([label, value], index) => (
          <div
            key={label}
            className={`grid grid-cols-[180px_1fr] items-center px-5 py-3 ${
              index % 2 === 0 ? "bg-white" : "bg-gray-50"
            }`}
          >
            <span className="text-sm font-medium text-gray-500">
              {label}
            </span>

            <span className="text-right text-sm font-semibold text-[#0B2F24]">
              {value || "-"}
            </span>
          </div>
        ))}

      </div>

    </section>
  );
}