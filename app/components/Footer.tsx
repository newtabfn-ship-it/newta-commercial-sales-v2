import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#071B14] text-white">

      <div className="mx-auto max-w-6xl px-6 py-20">

        <div className="grid items-center gap-16 lg:grid-cols-[220px_1fr_220px]">

          {/* Logo */}
          <div className="flex justify-center lg:justify-start">
            <Image
              src="/newta-logo.png"
              alt="NEWTA Commercial Sales"
              width={150}
              height={150}
              className="object-contain"
            />
          </div>

          {/* Commitment */}
          <div className="text-center lg:text-left">

            <p className="text-sm font-bold uppercase tracking-[6px] text-[#D4AF37]">
              Our Commitment
            </p>

            <h2 className="mt-4 text-3xl font-black text-white">
              Built on Trust.
              <br />
              Driven by Results.
            </h2>

            <p className="mt-8 text-lg leading-9 text-gray-300">
              At <strong>NEWTA Commercial Sales</strong>, we believe that every
              asset has value and every client deserves honest, professional
              service.
            </p>

            <p className="mt-6 text-lg leading-9 text-gray-300">
              Whether you're buying a single machine, selling an entire fleet,
              or looking for the right sales solution, we're committed to making
              the process straightforward, transparent and successful.
            </p>

            <p className="mt-6 text-xl font-semibold italic text-[#D4AF37]">
              Because every sale is more than a transaction—it&apos;s a new beginning.
            </p>

          </div>

          {/* Call To Action */}
          <div className="flex flex-col items-center gap-5">

            <Link
              href="/contact"
              className="w-full rounded-xl bg-[#D4AF37] px-6 py-4 text-center font-bold text-[#0B2F24] shadow-lg transition hover:bg-[#C89B2C]"
            >
              Contact Us
            </Link>

            <a
              href="tel:+27610156516"
              className="w-full rounded-xl border border-white/20 px-6 py-4 text-center font-semibold transition hover:bg-white hover:text-[#0B2F24]"
            >
              📞 Call NEWTA
            </a>

          </div>

        </div>

      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-6 py-6 text-center text-sm text-gray-500 md:flex-row">

          <p>
            © 2011 NEWTA Commercial Sales. All Rights Reserved.
          </p>

          <p>
            Bloemfontein • Free State • South Africa
          </p>

        </div>
      </div>

    </footer>
  );
}