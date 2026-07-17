import Image from "next/image";
import Link from "next/link";

export default function Navbar() {
  return (
    <header className="fixed top-0 left-0 w-full z-50">

      {/* Gold Contact Bar */}
      <div className="bg-[#D4AF37] text-[#0B2F24] text-sm font-semibold shadow-md">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center px-6 py-2">

          <div className="flex flex-wrap gap-6">
            <span>📞 +27 61 015 6516</span>
            <span>✉ newtabfn@gmail.com</span>
            <span>📍 Bloemfontein, South Africa</span>
          </div>

          <div className="hidden md:block">
            NEW BEGINNINGS
          </div>

        </div>
      </div>

      {/* Main Navigation */}
      <nav className="bg-green-950/90 backdrop-blur-md border-b border-[#D4AF37]/30 shadow-xl">

        <div className="max-w-7xl mx-auto px-6">

          <div className="flex items-center justify-between h-24">

            {/* Logo */}
            <Link href="/" className="flex items-center gap-4">

              <Image
                src="/newta-logo.png"
                alt="NEWTA Commercial Sales"
                width={105}
                height={105}
                priority
                className="object-contain"
              />

              <div className="hidden lg:block">
                <h2 className="text-white text-3xl font-extrabold tracking-wide">
                  NEWTA
                </h2>

                <p className="text-[#D4AF37] text-sm tracking-[5px] uppercase">
                  Commercial Sales
                </p>
              </div>

            </Link>

            {/* Navigation */}
            <div className="hidden lg:flex items-center gap-12 text-white font-semibold tracking-wide">

              <Link href="/" className="transition-all duration-300 hover:text-[#D4AF37]">
                Home
              </Link>

              <Link href="/equipment" className="transition-all duration-300 hover:text-[#D4AF37]">
                Equipment
              </Link>

              
              <Link href="/contact" className="transition-all duration-300 hover:text-[#D4AF37]">
                Contact
              </Link>

            </div>

          </div>

        </div>

      </nav>

    </header>
  );
}