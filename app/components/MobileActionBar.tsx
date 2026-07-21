"use client";

type Props = {
  equipmentId: string;
};

export default function MobileActionBar({ equipmentId }: Props) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-[#D4AF37] bg-white shadow-2xl md:hidden">

      <div className="grid grid-cols-3">

        <a
          href="tel:+27610156516"
          className="flex flex-col items-center justify-center py-3 text-[#0B2F24] font-semibold"
        >
          <span className="text-xl">📞</span>
          <span className="text-xs">Call</span>
        </a>

        <a
          href="https://wa.me/27610156516"
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center justify-center border-x border-gray-200 py-3 text-[#25D366] font-semibold"
        >
          <span className="text-xl">💬</span>
          <span className="text-xs">WhatsApp</span>
        </a>

        <a
          href={`/contact?id=${equipmentId}`}
          className="flex flex-col items-center justify-center py-3 text-[#D4AF37] font-semibold"
        >
          <span className="text-xl">✉️</span>
          <span className="text-xs">Enquire</span>
        </a>

      </div>

    </div>
  );
}