import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative min-h-screen overflow-hidden text-white">
      {/* Background */}
      <Image
        src="/hero.png"
        alt="NEWTA Commercial Sales"
        fill
        priority
        className="object-cover object-center"
      />

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-green-950/95 via-green-950/80 to-green-900/30" />

      {/* Content */}
      <div className="relative z-10 flex min-h-screen items-start">
        <div className="mx-auto w-full max-w-7xl px-6 pt-36 sm:pt-40 md:pt-44 lg:pt-32 xl:pt-36">
          <div className="max-w-2xl">

           {/* Logo */}
<div className="mt-10 sm:mt-12 md:mt-16 lg:mt-8">
  <Image
    src="/newta-logo.png"
    alt="NEWTA Commercial Sales"
    width={190}
    height={190}
    priority
    className="w-28 sm:w-32 md:w-40 lg:w-48 xl:w-52"
  />
</div>

            {/* Badge */}
            <p className="mt-4 text-sm font-semibold uppercase tracking-[4px] text-[#D4AF37]">
              Private Treaty Sales • Online Auctions
            </p>

            {/* Main Heading */}
            <h1 className="mt-5 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black leading-tight">
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
            <p className="mt-6 max-w-xl text-sm sm:text-base lg:text-lg leading-7 text-gray-200">
              NEWTA Commercial Sales connects buyers and sellers of
              commercial vehicles, machinery, plant equipment,
              agricultural assets, industrial equipment and business
              assets throughout South Africa.
            </p>

            {/* Buttons */}
            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Link
                href="/equipment"
                className="rounded-xl bg-[#D4AF37] px-6 sm:px-8 py-4 text-center text-base sm:text-lg font-bold ..."
              >
                View Equipment
              </Link>

              <Link
                href="/contact"
                className="rounded-xl bg-[#D4AF37] px-6 sm:px-8 py-4 text-center text-base sm:text-lg font-bold ..."
              >
                Sell Your Asset
              </Link>
            </div>

            {/* Trust Card */}
           <div className="mt-10 max-w-md rounded-2xl border border-[#D4AF37]/40 bg-white/10 p-4 sm:p-5 backdrop-blur-md">
              <div className="text-2xl">⭐⭐⭐⭐⭐</div>

             <h2 className="mt-3 text-base sm:text-lg font-bold">
  Trusted Private Treaty Sales
</h2>

<h3 className="mt-1 text-base sm:text-lg font-bold text-[#D4AF37]">
  Online Auctions
</h3>

<p className="mt-2 text-sm sm:text-base text-gray-300">
  Based in Bloemfontein • Serving South Africa Since 2011
</p>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}