type FormInputProps = {
  label?: string;
  name: string;
  value: string;
  placeholder?: string;
  type?: string;
  required?: boolean;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement>
  ) => void;
};

export default function FormInput({
  label,
  name,
  value,
  placeholder,
  type = "text",
  required = false,
  onChange,
}: FormInputProps) {
  return (
    <div className="space-y-2">
      {label && (
        <label className="font-semibold text-[#0B2F24]">
          {label}
        </label>
      )}

      <input
        type={type}
        name={name}
        value={value}
        required={required}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full rounded-lg border border-gray-300 p-3 focus:border-[#D4AF37] focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/30"
      />
    </div>
  );
}