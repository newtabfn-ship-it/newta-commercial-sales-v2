"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

type EquipmentGalleryProps = {
  images: string[];
  title: string;
};

export default function EquipmentGallery({
  images,
  title,
}: EquipmentGalleryProps) {
  const [selected, setSelected] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  const filmstripRef = useRef<HTMLDivElement>(null);

  const previousImage = () =>
    setSelected((prev) => (prev - 1 + images.length) % images.length);

  const nextImage = () =>
    setSelected((prev) => (prev + 1) % images.length);

  const scrollLeft = () => {
    filmstripRef.current?.scrollBy({
      left: -300,
      behavior: "smooth",
    });
  };

  const scrollRight = () => {
    filmstripRef.current?.scrollBy({
      left: 300,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    if (!filmstripRef.current) return;

    const thumb = filmstripRef.current.children[selected] as HTMLElement;

    thumb?.scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "nearest",
    });
  }, [selected]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case "ArrowLeft":
          previousImage();
          break;

        case "ArrowRight":
          nextImage();
          break;

        case "Escape":
          setIsOpen(false);
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () =>
      window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  return (
    <>
      {/* ================= HERO IMAGE ================= */}

      <div
  className="relative overflow-hidden rounded-3xl border-[3px] border-[#D4AF37] bg-[#111] shadow-2xl"
  style={{
    boxShadow:
      "0 15px 40px rgba(0,0,0,.25), 0 0 20px rgba(212,175,55,.25)",
  }}
>
       <Image
  src={images[selected]}
  alt={title}
  width={1600}
  height={1000}
  priority
  onClick={() => setIsOpen(true)}
  className="w-full h-[300px] lg:h-[340px] object-cover cursor-zoom-in transition-all duration-700 hover:scale-[1.01]"
/>
<div className="absolute left-6 top-6">
  <span className="rounded-lg bg-green-700 px-4 py-2 text-sm font-bold uppercase tracking-wider text-white shadow-lg">
    🟢 Available
  </span>
</div>

        {/* Fullscreen */}

        <button
  onClick={() => setIsOpen(true)}
  className="absolute bottom-5 right-5 rounded-full border border-white/30 bg-black/40 px-5 py-2 text-white backdrop-blur-md transition-all duration-300 hover:bg-[#D4AF37] hover:text-[#0B2F24]"
>
  ⛶ Fullscreen
</button>
      </div>

     {/* ================= FILMSTRIP ================= */}

<div className="mt-5 rounded-2xl border border-gray-200 bg-white p-4 shadow-lg">

  <div className="relative">

    {/* Left Arrow */}
    <button
      onClick={scrollLeft}
      className="absolute left-0 top-1/2 z-20 -translate-y-1/2 rounded-full bg-[#0B2F24] p-3 text-xl text-white shadow-lg transition hover:bg-[#D4AF37] hover:text-[#0B2F24]"
    >
      ‹
    </button>

    {/* Filmstrip */}
    <div
      ref={filmstripRef}
      className="mx-12 flex gap-4 overflow-x-auto scroll-smooth pb-2 scrollbar-hide"
    >
      {images.map((image, index) => (
        <div
          key={index}
          onClick={() => setSelected(index)}
          className="flex-shrink-0 cursor-pointer"
        >
          <div
            className={`overflow-hidden rounded-xl border-2 transition-all duration-300 ${
              selected === index
                ? "border-[#D4AF37] shadow-lg scale-105"
                : "border-gray-200 hover:border-[#D4AF37]"
            }`}
          >
            <Image
              src={image}
              alt={`${title} ${index + 1}`}
              width={170}
              height={110}
              className="h-24 w-40 object-cover transition-transform duration-500 hover:scale-105"
            />
          </div>

          {/* Gold Active Indicator */}
          <div
            className={`mt-2 h-1 rounded-full bg-[#D4AF37] transition-all duration-300 ${
              selected === index
                ? "opacity-100 scale-x-100"
                : "opacity-0 scale-x-0"
            }`}
          />
        </div>
      ))}
    </div>

    {/* Right Arrow */}
    <button
      onClick={scrollRight}
      className="absolute right-0 top-1/2 z-20 -translate-y-1/2 rounded-full bg-[#0B2F24] p-3 text-xl text-white shadow-lg transition hover:bg-[#D4AF37] hover:text-[#0B2F24]"
    >
      ›
    </button>

  </div>

</div>

     {/* ================= LIGHTBOX ================= */}

{isOpen && (
  <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-sm">

    {/* Close */}
    <button
      onClick={() => setIsOpen(false)}
      className="absolute right-8 top-8 rounded-full bg-white/10 p-3 text-3xl text-white backdrop-blur-md transition-all duration-300 hover:bg-[#D4AF37] hover:text-[#0B2F24]"
    >
      ✕
    </button>

    {/* Previous */}
    <button
      onClick={previousImage}
      className="absolute left-8 rounded-full bg-white/10 p-4 text-5xl text-white backdrop-blur-md transition-all duration-300 hover:bg-[#D4AF37] hover:text-[#0B2F24]"
    >
      ‹
    </button>

    {/* Image Panel */}
    <div className="flex flex-col items-center">

      <div className="overflow-hidden rounded-2xl border-4 border-[#D4AF37] bg-[#111] shadow-2xl">
        <Image
          src={images[selected]}
          alt={title}
          width={1800}
          height={1200}
          className="max-h-[78vh] w-auto max-w-[88vw] object-contain"
        />
      </div>

      {/* Title */}
      <h3 className="mt-5 text-xl font-bold text-white">
        {title}
      </h3>

      {/* Counter */}
      <div className="mt-3 rounded-full bg-white/10 px-5 py-2 text-sm text-white backdrop-blur-md">
        Image {selected + 1} of {images.length}
      </div>

      {/* Keyboard Help */}
      <div className="mt-4 text-sm text-gray-400">
        ← Previous &nbsp;&nbsp; • &nbsp;&nbsp; → Next &nbsp;&nbsp; • &nbsp;&nbsp; Esc Close
      </div>

    </div>

    {/* Next */}
    <button
      onClick={nextImage}
      className="absolute right-8 rounded-full bg-white/10 p-4 text-5xl text-white backdrop-blur-md transition-all duration-300 hover:bg-[#D4AF37] hover:text-[#0B2F24]"
    >
      ›
    </button>

  </div>
 )}
    </>
  );
}