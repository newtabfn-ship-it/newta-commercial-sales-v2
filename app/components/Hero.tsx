import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative min-h-screen overflow-hidden text-white">

      {/* Background Image */}
      <Image
        src="/hero.png"
        alt="NEWTA Commercial Sales"
        fill
        priority
        className="object-cover"
      />

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-green-950/95 via-green-950/80 to-transparent" />

      <div className="relative z-10 flex items-start h-full pt-34">
        <div className="max-w-7xl mx-auto w-full px-8">

          <div className="max-w-3xl">          {/* NEWTA Logo */}
          <div className="mb-5">
           <Image
             src="/newta-logo.png"
             alt="NEWTA Commercial Sales"
             width={220}
             height={220}
              priority
              className="drop-shadow-2xl"
            />

            <p className="mt-3 text-[#D4AF37] uppercase tracking-[10px] font-semibold text-base">
              NEW BEGINNINGS
            </p>
          </div>

          <p className="text-[#D4AF37] uppercase tracking-[6px] font-semibold">
            Private Treaty Sales
          </p>

          <h1 className="mt-6 text-4xl md:text-5xl lg:text-6xl font-black leading-tight">
            Commercial Equipment
            <br />
            You Can Trust
          </h1>

          <p className="mt-8 text-lg md:text-xl leading-8 text-gray-100 text-gray-200">
            NEWTA Commercial Sales connects buyers and sellers of quality
            construction, mining, agricultural and commercial equipment
            throughout South Africa.
          </p>

          <div className="mt-12 flex flex-wrap gap-6">

            <Link
              href="/equipment"
              className="rounded-xl bg-[#D4AF37] px-8 py-4 text-lg font-bold text-black shadow-xl transition hover:bg-[#C89B2C]"
            >
              View Equipment
            </Link>

            <Link
              href="/contact"
              className="rounded-xl border-2 border-white px-8 py-4 text-lg font-bold transition hover:bg-white hover:text-green-900"
            >
              Sell Your Equipment
            </Link>

          </div>          </div>

        </div>

      </div>

    </section>
  );
}