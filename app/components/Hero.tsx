import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative overflow-hidden min-h-screen text-white">

      {/* Background */}
      <Image
        src="/hero.png"
        alt="NEWTA Commercial Sales"
        fill
        priority
        className="object-cover object-center"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-green-950/95 via-green-950/80 to-green-900/30" />

      <div className="relative z-10 flex items-center min-h-screen">

        <div className="mx-auto w-full max-w-7xl px-6 sm:px-8">

          <div className="max-w-2xl">

            {/* Logo */}
            <Image
              src="/newta-logo.png"
              alt="NEWTA Commercial Sales"
              width={220}
              height={220}
              priority
              className="w-40 sm:w-48 md:w-56 lg:w-64 drop-shadow-2xl"
            />

            {/* NEW BEGINNINGS */}
            <p className="mt-4 text-sm sm:text-base uppercase tracking-[8px] text-[#D4AF37] font-semibold">
              NEW BEGINNINGS
            </p>

            {/* Private Treaty */}
            <p className="mt-4 uppercase tracking-[4px] text-[#D4AF37] font-bold text-sm">
              Private Treaty Sales
            </p>

            {/* Heading */}
           <h1 className="mt-6 text-4xl sm:text-5xl lg:text-6xl font-black leading-tight">

  Commercial Vehicles

  <br />

  Machinery

  <br />

  Plant &amp; Equipment

  <br />

  <span className="text-[#D4AF37]">
    Agriculture &amp; More
  </span>

</h1>

            {/* Description */}
            <p className="mt-8 max-w-2xl text-lg md:text-xl leading-8 text-gray-200">

  NEWTA Commercial Sales connects buyers and sellers of commercial
  vehicles, machinery, plant equipment, agricultural assets,
  industrial equipment and business assets throughout South Africa.

</p>

            {/* Buttons */}
            <div className="mt-10 flex flex-col sm:flex-row gap-4">

              <Link
                href="/equipment"
                className="rounded-xl bg-[#D4AF37] px-8 py-4 text-center text-lg font-bold text-black shadow-xl transition hover:bg-[#C89B2C]"
              >
                View Equipment
              </Link>

              <Link
                href="/contact"
                className="rounded-xl border-2 border-white px-8 py-4 text-center text-lg font-bold transition hover:bg-white hover:text-green-900"
              >
                Sell Your Asset
              </Link>

            </div>

            {/* Trust */}
            <div className="mt-12 border-l-4 border-[#D4AF37] pl-5">

              <p className="text-2xl">
                ⭐⭐⭐⭐⭐
              </p>

              <p className="mt-2 font-semibold text-lg">
                Trusted Private Treaty Sales
              </p>

              <p className="text-gray-300">
                Based in Bloemfontein • Serving South Africa Since 2011
              </p>

            </div>

          </div>

        </div>

      </div>

    </section>
  );
}