export default function Services() {
 const services = [
  {
    title: "Private Treaty Sales",
    icon: "🤝",
    description:
      "Professional private treaty sales that connect buyers and sellers through a transparent, personalised sales process.",
  },
  {
  title: "Online Auctions",
  icon: "💻",
  description:
    "Professional online auctions for commercial vehicles, machinery, industrial assets and business disposals, providing nationwide exposure and competitive bidding."
},
  {
    title: "Asset Liquidations",
    icon: "💼",
    description:
      "Complete asset disposal solutions for businesses, liquidators, financial institutions and estate sales.",
  },
  {
    title: "Fleet Rollovers",
    icon: "🚛",
    description:
      "Helping companies replace commercial vehicles and equipment through structured fleet rollover programmes.",
  },
  {
    title: "Asset Marketing",
    icon: "📸",
    description:
      "Professional photography, advertising and nationwide marketing to maximise exposure and achieve the best possible sale price.",
  },
  {
    title: "Buyer & Seller Support",
    icon: "🤝",
    description:
      "From the first enquiry to the final handover, NEWTA provides personal assistance throughout every transaction.",
  },
  {
    title: "Nationwide Coverage",
    icon: "🇿🇦",
    description:
      "Based in Bloemfontein and proudly serving buyers and sellers across every province in South Africa.",
  },
];
  return (
    <section className="bg-[#F8F8F8] py-24">
      <div className="mx-auto max-w-7xl px-6">

        <div className="text-center">
         <p className="text-sm font-bold uppercase tracking-[6px] text-[#D4AF37]">
  What We Do
</p>

<h2 className="mt-4 text-3xl md:text-5xl font-black text-[#0B2F24]">
  Professional Commercial Sales Services
</h2>

<p className="mx-auto mt-6 max-w-3xl text-base md:text-lg leading-8 text-gray-600">
  NEWTA Commercial Sales provides complete commercial asset solutions through Private Treaty Sales, Online Auctions, asset marketing and nationwide sales services for businesses across South Africa.
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