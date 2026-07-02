export default function Services() {
  const services = [
    {
      title: "Commercial Equipment Sales",
      icon: "🏗️",
      description:
        "Professional private treaty sales of commercial and industrial equipment across South Africa.",
    },
    {
      title: "Asset Liquidations",
      icon: "💼",
      description:
        "Complete asset disposal solutions for businesses, liquidators and financial institutions.",
    },
    {
      title: "Fleet Rollovers",
      icon: "🚛",
      description:
        "Helping companies upgrade fleets through structured asset sales and replacement programs.",
    },
    {
      title: "Plant Hire",
      icon: "🏭",
      description:
        "Marketing and sourcing quality plant and equipment to meet project requirements.",
    },
    {
      title: "Marketing of Assets",
      icon: "📢",
      description:
        "Professional photography, advertising and nationwide exposure to maximise asset value.",
    },
    {
      title: "Nationwide Coverage",
      icon: "🇿🇦",
      description:
        "Based in Bloemfontein and serving buyers and sellers throughout South Africa.",
    },
  ];

  return (
    <section className="bg-[#F8F8F8] py-24">
      <div className="mx-auto max-w-7xl px-6">

        <div className="text-center">
          <h2 className="text-5xl font-bold text-[#0B2F24]">
            Our Services
          </h2>

          <p className="mt-6 text-xl text-gray-600 max-w-3xl mx-auto">
            NEWTA Commercial Sales provides complete commercial asset solutions
            for businesses throughout South Africa.
          </p>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">

          {services.map((service) => (
            <div
              key={service.title}
              className="rounded-2xl bg-white p-8 shadow-md transition duration-300 hover:-translate-y-2 hover:shadow-xl"
            >
              <div className="text-5xl">{service.icon}</div>

              <h3 className="mt-6 text-2xl font-bold text-[#0B2F24]">
                {service.title}
              </h3>

              <p className="mt-4 leading-8 text-gray-600">
                {service.description}
              </p>
            </div>
          ))}

        </div>
      </div>
    </section>
  );
}