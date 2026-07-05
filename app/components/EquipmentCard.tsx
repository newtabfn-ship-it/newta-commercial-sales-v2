import Link from "next/link";
type Props = {
  id: string;
  image: string;
  title: string;
  year: string;
  status: string
  price: string;
  hours: string;
  location: string;
};
export default function EquipmentCard({
  id,
  image,
  title,
  year,
  status,
  price,
  hours,
  location,
}: Props) {
  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow-lg transition duration-300 hover:-translate-y-2 hover:shadow-2xl">

      <div className="relative">

 <div
  className={`absolute top-4 right-4 rounded-full px-4 py-1 text-xs font-bold uppercase text-white shadow-lg ${
    status === "Available"
      ? "bg-green-600"
      : "bg-red-600"
  }`}
>
  {status}
</div>

        <img
          src={image}
          alt={title}
          className="h-64 w-full object-cover"
        />

              </div>

      <div className="p-6">

          <h3 className="text-2xl font-bold text-[#222222]">
    {title}
  </h3>

  <p className="mt-2 text-gray-600">
    <span className="font-semibold">Year:</span> {year}
  </p>

  <p className="mt-2 text-gray-600">
    <span className="font-semibold">Price:</span> {price}
  </p>

  <p className="mt-2 text-gray-600">
    <span className="font-semibold">Hours:</span> {hours}
  </p>

  <p className="mt-2 text-gray-600">
    <span className="font-semibold">Location:</span> {location}
  </p>

  <Link
  href={`/equipment/${id}`}
  className="mt-6 block w-full rounded-xl bg-[#D4AF37] py-3 text-center font-bold text-[#0B2F24] shadow-lg transition-all duration-300 hover:bg-[#C89B2C] hover:shadow-xl"
>
  View Details
</Link>

</div>

    </div>
  );
}