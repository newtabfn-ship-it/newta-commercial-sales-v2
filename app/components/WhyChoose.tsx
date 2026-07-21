export default function WhyChoose() {
  const items = [
  {
    icon: "🤝",
    title: "Private Treaty Sales",
    text: "Professional negotiated sales connecting serious buyers and sellers through a transparent, personalised process.",
  },
  {
    icon: "💻",
    title: "Online Auctions",
    text: "Professional online auctions providing nationwide exposure, competitive bidding and efficient asset disposal.",
  },
  {
    icon: "🇿🇦",
    title: "Nationwide Coverage",
    text: "Based in Bloemfontein and proudly serving buyers and sellers throughout every province in South Africa.",
  },
  {
    icon: "👤",
    title: "Personal Service",
    text: "Deal directly with an experienced commercial sales specialist from your first enquiry through to the successful completion of your sale.",
  },
];

  return (
    <section className="py-20 bg-gray-100">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-4xl font-bold text-center mb-4">
          Why Choose NEWTA?
        </h2>

        <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
          Professional service, trusted experience and quality commercial
          equipment.
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
         {items.map((item) => (
  <div
    key={item.title}
    className="rounded-2xl bg-white p-8 text-center shadow-lg transition duration-300 hover:-translate-y-2 hover:shadow-2xl"
  >
    <div className="mb-5 text-5xl">
      {item.icon}
    </div>

    <h3 className="text-2xl font-bold text-[#0B2F24]">
      {item.title}
    </h3>

    <p className="mt-4 leading-7 text-gray-600">
      {item.text}
    </p>
  </div>
))}
        </div>
      </div>
    </section>
  );
}