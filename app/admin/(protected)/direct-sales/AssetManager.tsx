"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import ImageUploader from "@/app/admin/components/equipment/ImageUploader";
import { assetStatuses, directSaleCategories, toSastInput } from "@/lib/directSales";

type Photo = { url: string; publicId: string };
type Asset = {
  _id: string; slug: string; title: string; referenceNumber: string; category: string;
  description: string; specifications: string; location: string; askingPriceCents: number | null;
  closesAt: string | null; status: string; updatedAt: string; images: (Photo & { cover: boolean })[];
};
const empty = { title: "", referenceNumber: "", category: "", description: "", specifications: "",
  location: "", askingPrice: "", closingSast: "", status: "Draft" };
const field = "mt-1 w-full rounded-lg border border-gray-300 bg-white p-2.5";

export default function AssetManager() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [editing, setEditing] = useState<Asset | null>(null);
  const [draft, setDraft] = useState(empty);
  const [images, setImages] = useState<Photo[]>([]);
  const [cover, setCover] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const uploadInProgress = useRef(false);
  const saveInProgress = useRef(false);
  const busy = uploading || saving;

  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/admin/direct-sales/assets", { signal: controller.signal, cache: "no-store" })
      .then(async (response) => {
        const result = await response.json();
        if (!response.ok) throw new Error(result.error ?? "Could not load assets.");
        setAssets(result.assets);
      })
      .catch((failure) => { if (!controller.signal.aborted) setError(failure.message); })
      .finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, []);

  function select(asset: Asset | null) {
    setEditing(asset);
    setDraft(asset ? {
      title: asset.title, referenceNumber: asset.referenceNumber, category: asset.category,
      description: asset.description, specifications: asset.specifications, location: asset.location,
      askingPrice: asset.askingPriceCents == null ? "" : (asset.askingPriceCents / 100).toFixed(2),
      closingSast: asset.closesAt ? toSastInput(asset.closesAt) : "", status: asset.status,
    } : empty);
    setImages(asset?.images ?? []);
    setCover(Math.max(0, asset?.images.findIndex((image) => image.cover) ?? 0));
    setError("");
    setNotice("");
  }

  function update(name: keyof typeof empty, value: string) {
    setDraft((previous) => ({ ...previous, [name]: value }));
  }

  async function save(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (saveInProgress.current || uploadInProgress.current) return;
    saveInProgress.current = true;
    setSaving(true);
    setError("");
    setNotice("");
    try {
      const response = await fetch(`/api/admin/direct-sales/assets${editing ? "/" + editing._id : ""}`, {
        method: editing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...draft, updatedAt: editing?.updatedAt,
          images: images.map((image, index) => ({ ...image, cover: index === cover })) }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error ?? "Could not save the asset.");
      const asset: Asset = result.asset;
      setAssets((previous) => previous.some(({ _id }) => _id === asset._id)
        ? previous.map((entry) => entry._id === asset._id ? asset : entry)
        : [asset, ...previous]);
      select(asset);
      setNotice("Direct Sales asset saved.");
    } catch (failure) {
      setError(failure instanceof Error ? failure.message : "Could not save the asset.");
    } finally {
      saveInProgress.current = false;
      setSaving(false);
    }
  }

  return <main className="space-y-6">
    <h1 className="text-3xl font-bold text-[#0B2F24]">Direct Sales Assets</h1>
    <Link className="underline" href="/admin/direct-sales/offers">View Direct Sales Offers</Link>
    <section className="rounded-xl bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-xl font-bold">Inventory</h2>
        <button type="button" disabled={busy} onClick={() => select(null)} className="rounded bg-[#0B2F24] px-4 py-2 text-white disabled:opacity-50">New asset</button>
      </div>
      {loading ? <p>Loading assets…</p> : !assets.length && <p>No Direct Sales assets yet.</p>}
      <ul className="mt-3 divide-y">
        {assets.map((asset) => <li key={asset._id} className="flex flex-wrap items-center justify-between gap-2 py-3">
          <span>{asset.referenceNumber} · {asset.title} · {asset.status}</span>
          <button type="button" className="underline disabled:opacity-50" disabled={busy} onClick={() => select(asset)}>Edit</button>
        </li>)}
      </ul>
    </section>
    <form onSubmit={save} className="space-y-5 rounded-xl bg-white p-5 shadow-sm">
      <h2 className="text-xl font-bold">{editing ? "Edit Direct Sales asset" : "Create Direct Sales asset"}</h2>
      <fieldset disabled={busy} className="grid gap-4 sm:grid-cols-2">
        <label>Title<input className={field} value={draft.title} onChange={(e) => update("title", e.target.value)} required maxLength={150} /></label>
        <label>Reference<input className={field} value={draft.referenceNumber} onChange={(e) => update("referenceNumber", e.target.value)} required maxLength={60} /></label>
        <label>Category<select className={field} value={draft.category} onChange={(e) => update("category", e.target.value)} required>
          <option value="">Select category</option>
          {directSaleCategories.map(({ slug, name }) => <option key={slug} value={slug}>{name}</option>)}
        </select></label>
        <label>Status<select className={field} value={draft.status} onChange={(e) => update("status", e.target.value)}>
          {assetStatuses.map((status) => <option key={status}>{status}</option>)}
        </select></label>
        <label>Location<input className={field} value={draft.location} onChange={(e) => update("location", e.target.value)} maxLength={120} /></label>
        <label>Asking price (ZAR, optional)<input className={field} inputMode="decimal" value={draft.askingPrice} onChange={(e) => update("askingPrice", e.target.value)} maxLength={15} /></label>
        <label>Offer closing time (SAST, optional)<input className={field} type="datetime-local" value={draft.closingSast} onChange={(e) => update("closingSast", e.target.value)} /></label>
        <label className="sm:col-span-2">Description<textarea className={field} value={draft.description} onChange={(e) => update("description", e.target.value)} maxLength={6000} rows={4} /></label>
        <label className="sm:col-span-2">Specifications<textarea className={field} value={draft.specifications} onChange={(e) => update("specifications", e.target.value)} maxLength={6000} rows={4} /></label>
      </fieldset>
      <fieldset disabled={busy}>
        <ImageUploader images={images} setImages={setImages} coverImage={cover} setCoverImage={setCover}
          disabled={saving} uploadUrl="/api/admin/direct-sales/upload" onUploadChange={(value) => {
            uploadInProgress.current = value;
            setUploading(value);
          }} />
      </fieldset>
      {error && <p role="alert" className="text-red-800">{error}</p>}
      {notice && <p role="status" className="text-green-900">{notice}</p>}
      <div className="flex flex-wrap items-center gap-4">
        <button disabled={busy} className="rounded bg-[#D4AF37] px-5 py-2 font-bold disabled:opacity-50">{saving ? "Saving…" : uploading ? "Uploading…" : "Save asset"}</button>
        {editing && editing.status !== "Draft" && <Link href={`/direct-sales/${editing.slug}`} className="underline">View public asset</Link>}
      </div>
    </form>
  </main>;
}
