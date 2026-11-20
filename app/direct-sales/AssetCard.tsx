import Image from "next/image";
import Link from "next/link";
import { cloudinaryImage } from "@/lib/cloudinaryImage";
import { acceptsOffers, formatRand } from "@/lib/directSales";

type CardAsset = {
  _id: unknown; slug: string; title: string; location?: string; status: string;
  closesAt?: Date | string | null; askingPriceCents?: number | null;
  images: { url: string; cover?: boolean }[];
};

export default function AssetCard({ asset }: { asset: CardAsset }) {
  return <article className="overflow-hidden rounded-2xl bg-white shadow">
    <Image src={cloudinaryImage(asset.images.find(({ cover }) => cover)?.url ?? asset.images[0]?.url ?? "/og-image.png")}
      alt={asset.title} width={800} height={600} className="h-52 w-full object-cover" />
    <div className="space-y-2 p-5">
      <p className="text-sm font-semibold text-[#0B2F24]">{acceptsOffers(asset) ? "Offers open" : "Offers closed"}</p>
      <h3 className="text-xl font-bold">{asset.title}</h3>
      {asset.location && <p>{asset.location}</p>}
      {asset.askingPriceCents != null ? <p>Asking price: {formatRand(asset.askingPriceCents)}</p> : <p>Advertised price not provided. Contact NEWTA for price information.</p>}
      <Link href={`/direct-sales/${asset.slug}`} className="inline-block rounded-lg bg-[#D4AF37] px-4 py-2 font-bold text-[#0B2F24]">VIEW DETAILS / MAKE AN OFFER</Link>
    </div>
  </article>;
}
