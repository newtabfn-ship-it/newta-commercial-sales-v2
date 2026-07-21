import Image from "next/image";
export default function About() {
  return (
    <section className="bg-white py-24">
      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-24 items-center">

        {/* Left Side */}
        <div>
          <p className="text-[#D4AF37] font-semibold tracking-widest uppercase mb-3">
  
              About NEWTA
          </p>
<h2 className="text-5xl font-bold text-zinc-900 mb-4">
  Who We Are
</h2>

<div className="w-24 h-1 bg-[#D4AF37] rounded-full mb-8"></div>
          
                  

          <p className="text-lg text-gray-600 leading-9 mb-6">
            At NEWTA, we believe in good people and honest work.
            Specialising in Commercial & Industrial sales, marketing,
            asset liquidations, and plant hire, we have built our
            reputation on transparency, grit, and local expertise.
          </p>

          <p className="text-lg text-gray-600 leading-9 mb-6">
            Based in Bloemfontein and serving the Free State,
            Northern Cape, and all of South Africa, we connect
            buyers and sellers through a straightforward,
            reliable private treaty sales platform.
          </p>

          <p className="text-lg text-gray-600 leading-9 mb-6">
            We do not just move machinery—we move businesses
            forward. Every asset disposal, fleet rollover,
            and equipment sale represents second chances
            and new beginnings.
          </p>
          <div className="grid grid-cols-2 gap-8 mt-12">

  <div className="rounded-2xl bg-gray-50 p-6 shadow-sm transition duration-300 hover:shadow-xl">
    <h3 className="text-4xl font-bold text-[#D4AF37]">14+</h3>
    <p className="text-gray-600 mt-2">Years Experience</p>
  </div>

  <div className="rounded-2xl bg-gray-50 p-6 shadow-sm transition duration-300 hover:shadow-xl">
   <h3 className="text-4xl font-bold text-[#D4AF37]">500+</h3>
    <p className="text-gray-600 mt-2">Assets Sold</p>
  </div>

  <div className="rounded-2xl bg-gray-50 p-6 shadow-sm transition duration-300 hover:shadow-xl">
    <h3 className="text-4xl font-bold text-[#D4AF37]">Nationwide</h3>
    <p className="text-gray-600 mt-2">Private Treaty Sales</p>
  </div>

 <div className="rounded-2xl bg-gray-50 p-6 shadow-sm transition duration-300 hover:shadow-xl">
    <h3 className="text-4xl font-bold text-[#D4AF37]">100%</h3>
    <p className="text-gray-600 mt-2">Personal Service</p>
  </div>

</div>
        </div>

        {/* Right Side */}
        <div className="overflow-hidden rounded-3xl shadow-2xl transition duration-500 hover:scale-[1.02]">
  <Image
    src="/about.jpg"
    alt="NEWTA Commercial Sales"
    width={800}
    height={600}
    priority={false}
    sizes="(max-width: 768px) 100vw, 50vw"
    className="h-[450px] md:h-[600px] w-full object-cover"
  />
</div>

      </div>
    </section>
  );
}