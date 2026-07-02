import EquipmentCard from "./EquipmentCard";
import { equipment } from "../data/equipment";

export default function FeaturedListings() {
  return (
    <section className="bg-gray-100 py-20">
      <div className="mx-auto max-w-7xl px-6">

        <h2 className="mb-12 text-5xl font-bold">
          Featured Listings
        </h2>

        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">

          {equipment.slice(0, 3).map((item) => (
            <EquipmentCard
              key={item.id}
              id={item.id}
              image={item.images[0]}
              title={item.title}
              year={item.year}
              status={item.status}
              price={item.price}
              hours={item.hours}
              location={item.location}
            />
          ))}

        </div>

      </div>
    </section>
  );
}