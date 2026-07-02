export default function Contact() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">

        <div className="text-center mb-16">
          <p className="text-[#D4AF37] uppercase tracking-widest">
  
            Contact Us
          </p>

          <h2 className="text-5xl font-bold mt-3">
            Let's Talk Equipment
          </h2>

          <p className="text-gray-600 mt-6 max-w-2xl mx-auto">
            Looking to buy or sell commercial equipment? Get in touch with
            NEWTA Commercial Sales today.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12">

          <div className="bg-gray-50 rounded-3xl p-10">

            <h3 className="text-2xl font-bold mb-8">
              Contact Information
            </h3>

            <div className="space-y-6">

              <div>
                <p className="font-semibold">Phone</p>
                <a
  href="tel:+27610156516"
  className="text-gray-600 hover:text-[#D4AF37] transition"
>
  +27 61 015 6516
</a>
              </div>

              <div>
                <p className="font-semibold">Email</p>
                <a
  href="mailto:newtabfn@gmail.com"
  className="text-gray-600 hover:text-[#D4AF37] transition"
>
  newtabfn@gmail.com
</a>
              </div>

              <div>
                <p className="font-semibold">Location</p>
                <p className="text-gray-600">
                  Bloemfontein, South Africa
                </p>
              </div>

            </div>
          </div>

          <div className="bg-gradient-to-br from-[#D4AF37] to-[#D4AF37] rounded-3xl p-10 text-white shadow-xl">

            <h3 className="text-3xl font-bold">
              Ready to Buy or Sell?
            </h3>

            <p className="mt-6 text-[#D4AF37]">
              Contact NEWTA today for professional private treaty sales,
              asset disposals and commercial equipment solutions.
            </p>

            <div className="mt-10">
              <a
                href="mailto:newtabfn@gmail.com"
                className="inline-block bg-white text-[#D4AF37] px-8 py-4 rounded-xl font-semibold hover:scale-105 transition duration-300 shadow-lg"
              >
                Email NEWTA
              </a>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}