export default function WhyChoose() {
  const items = [
    {
      title: "Trusted Private Treaty Sales",
      text: "Over a decade of experience connecting serious buyers and sellers.",
    },
    {
      title: "Quality Equipment",
      text: "Every listing is carefully selected before being advertised.",
    },
    {
      title: "Nationwide Coverage",
      text: "Buying and selling equipment throughout South Africa.",
    },
    {
      title: "Personal Service",
      text: "Deal directly with an experienced equipment specialist from start to finish.",
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
              className="bg-white rounded-xl shadow p-8 text-center"
            >
              <h3 className="font-bold text-xl mb-4">{item.title}</h3>
              <p className="text-gray-600">{item.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}