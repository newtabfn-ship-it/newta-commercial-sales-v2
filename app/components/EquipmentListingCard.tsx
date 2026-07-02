import Image from "next/image";
import Link from "next/link";

type EquipmentListingCardProps = {
  image: string;
  title: string;
  year: string;
  hours: string;
  location: string;
  price: string;
  status: "Available" | "Sold";
};

export default function EquipmentListingCard({
  image,
  title,
  year,
  hours,
  location,
  price,
  status,
}: EquipmentListingCardProps) {
  return (
    <div className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition duration-300">

      <div className="relative h-72">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover"
        />

        <div
          className={`absolute top-5 left-5 px-4 py-2 rounded-full text-white font-bold ${
            status === "Available"
              ? "bg-green-600"
              : "bg-red-600"
          }`}
        >
          {status}
        </div>
      </div>

      <div className="p-8">
        <h2 className="text-2xl font-bold">{title}</h2>

        <p className="text-orange-500 text-3xl font-bold mt-4">
          {price}
        </p>

        <div className="mt-6 space-y-2 text-gray-600">
          <p><strong>Year:</strong> {year}</p>
          <p><strong>Hours:</strong> {hours}</p>
          <p><strong>Location:</strong> {location}</p>
        </div>

        <Link
          href="/equipment"
          className="inline-block mt-8 bg-orange-500 hover:bg-orange-600 transition text-white px-6 py-3 rounded-xl font-bold"
        >
          View Details
        </Link>
      </div>
    </div>
  );
}