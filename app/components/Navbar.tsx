"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
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

           {/* Desktop Navigation */}
<div className="hidden lg:flex items-center gap-12 text-white font-semibold tracking-wide">

  <Link href="/" className="transition hover:text-[#D4AF37]">
    Home
  </Link>

  <Link href="/equipment" className="transition hover:text-[#D4AF37]">
    Equipment
  </Link>

  <Link href="/contact" className="transition hover:text-[#D4AF37]">
    Contact
  </Link>

</div>

{/* Mobile Menu Button */}
<button
  onClick={() => setMobileOpen(true)}
  className="lg:hidden text-white text-4xl"
  aria-label="Open menu"
>
  ☰
</button>
          </div>

        </div>

      </nav>

{/* ================= MOBILE MENU ================= */}

{mobileOpen && (
  <>
    {/* Background */}
    <div
      className="fixed inset-0 z-40 bg-black/60"
      onClick={() => setMobileOpen(false)}
    />

    {/* Drawer */}
    <div className="fixed right-0 top-0 z-50 h-full w-80 max-w-[85vw] bg-[#0B2F24] shadow-2xl">

      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#D4AF37]/30 p-6">

        <Image
          src="/newta-logo.png"
          alt="NEWTA"
          width={70}
          height={70}
        />

        <button
          onClick={() => setMobileOpen(false)}
          className="text-4xl text-white"
        >
          ✕
        </button>

      </div>

      {/* Navigation */}
      <div className="flex flex-col p-6 text-xl">

        <Link
          href="/"
          onClick={() => setMobileOpen(false)}
          className="border-b border-white/10 py-4 text-white hover:text-[#D4AF37]"
        >
          🏠 Home
        </Link>

        <Link
          href="/equipment"
          onClick={() => setMobileOpen(false)}
          className="border-b border-white/10 py-4 text-white hover:text-[#D4AF37]"
        >
          🚜 Equipment
        </Link>

        <Link
          href="/contact"
          onClick={() => setMobileOpen(false)}
          className="border-b border-white/10 py-4 text-white hover:text-[#D4AF37]"
        >
          ✉️ Contact
        </Link>

      </div>

      {/* Contact Buttons */}
      <div className="mt-8 space-y-4 px-6">

        <a
          href="tel:+27610156516"
          className="block rounded-xl bg-[#D4AF37] py-4 text-center font-bold text-[#0B2F24]"
        >
          📞 Call NEWTA
        </a>

        <a
          href="https://wa.me/27610156516"
          target="_blank"
          rel="noopener noreferrer"
          className="block rounded-xl bg-green-600 py-4 text-center font-bold text-white"
        >
          💬 WhatsApp
        </a>

        <a
          href="mailto:newtabfn@gmail.com"
          className="block rounded-xl border border-white py-4 text-center font-bold text-white"
        >
          ✉️ Email
        </a>

      </div>

    </div>
  </>
)}
    </header>
  );
}