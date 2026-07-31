type FormSelectProps = {
  label?: string;
  name: string;
  value: string;
  required?: boolean;
  onChange: (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => void;
  children: React.ReactNode;
};

export default function FormSelect({
  label,
  name,
  value,
  required = false,
  onChange,
  children,
}: FormSelectProps) {
  return (
    <div className="space-y-2">
      {label && (
        <label className="font-semibold text-[#0B2F24]">
          {label}
        </label>
      )}

      <select
        name={name}
        value={value}
        required={required}
        onChange={onChange}
        className="w-full rounded-lg border border-gray-300 p-3 focus:border-[#D4AF37] focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/30"
      >
        {children}
      </select>
    </div>
  );
}