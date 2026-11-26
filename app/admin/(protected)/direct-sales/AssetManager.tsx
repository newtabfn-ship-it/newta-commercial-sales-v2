"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import ImageUploader from "@/app/admin/components/equipment/ImageUploader";
import { assetStatuses, directSaleCategories, directSaleSubcategoryAllowed, directSalePhotoLimit, directSalePhotoLimitMessage, toSastInput } from "@/lib/directSales";

type Photo = { url: string; publicId: string };
type Portfolio = { id: string; title: string; status: "Draft" | "Published" | "Archived" };
type Asset = {
  _id: string; slug: string; title: string; referenceNumber: string; category: string; subcategory?: string;
  description: string; specifications: string; location: string; askingPriceCents: number | null;
  closesAt: string | null; status: string; updatedAt: string; images: (Photo & { cover: boolean })[];
  portfolioId?: string | null;
};
const empty = { title: "", referenceNumber: "", category: "", subcategory: "", description: "", specifications: "",
  location: "", askingPrice: "", closingSast: "", status: "Draft", portfolioId: "" };
const field = "mt-1 w-full rounded-lg border border-gray-300 bg-white p-2.5";

export default function AssetManager() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [editing, setEditing] = useState<Asset | null>(null);
  const [draft, setDraft] = useState(empty);
  const [images, setImages] = useState<Photo[]>([]);
  const [cover, setCover] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [portfoliosLoading, setPortfoliosLoading] = useState(true);
  const [portfolioError, setPortfolioError] = useState("");
  const [portfolioRefresh, setPortfolioRefresh] = useState(0);
  const [portfolioFilter, setPortfolioFilter] = useState("");
  const uploadInProgress = useRef(false);
  const saveInProgress = useRef(false);
  const deleteInProgress = useRef(false);
  const busy = uploading || saving || deleting;

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

  useEffect(() => {
    const controller = new AbortController();
    setPortfoliosLoading(true);
    setPortfolioError("");
    async function loadPortfolios() {
      const choices: Portfolio[] = [];
      // Read paginated public-field Admin DTOs only, never private clients.
      for (let page = 1; page <= 9999; page++) {
        const response = await fetch("/api/admin/direct-sales/portfolios?page=" + page, {
          signal: controller.signal, cache: "no-store", credentials: "same-origin",
        });
        const data = await response.json().catch(() => null);
        if (!response.ok || !Array.isArray(data?.portfolios)) throw new Error("Could not load Sales Portfolio choices. Existing assignments are preserved.");
        choices.push(...data.portfolios);
        if (!data.hasMore) {
          if (!controller.signal.aborted) setPortfolios([...new Map(choices.map(choice => [choice.id, choice])).values()]);
          return;
        }
      }
      throw new Error("Sales Portfolio choices exceed the supported page limit.");
    }
    loadPortfolios()
      .catch(failure => { if (!controller.signal.aborted) setPortfolioError(failure.message); })
      .finally(() => { if (!controller.signal.aborted) setPortfoliosLoading(false); });
    return () => controller.abort();
  }, [portfolioRefresh]);

  const portfolioLabel = (id?: string | null) => {
    if (!id) return "Unassigned";
    const portfolio = portfolios.find(choice => choice.id === id);
    return portfolio ? portfolio.title + " — " + (portfolio.status === "Archived" ? "Archived (Sales Portfolio hidden)" : portfolio.status)
      : "Sales Portfolio ID: " + id + " (details unavailable)";
  };
  const unknownPortfolios = [...new Set(assets.map(asset => asset.portfolioId).filter((id): id is string => Boolean(id)))]
    .filter(id => !portfolios.some(choice => choice.id === id));
  const visibleAssets = assets.filter(asset => !portfolioFilter || (portfolioFilter === "unassigned"
    ? !asset.portfolioId : asset.portfolioId === portfolioFilter));

  function select(asset: Asset | null) {
    setEditing(asset);
    setDraft(asset ? {
      title: asset.title, referenceNumber: asset.referenceNumber, category: asset.category, subcategory: asset.subcategory ?? "",
      description: asset.description, specifications: asset.specifications, location: asset.location,
      askingPrice: asset.askingPriceCents == null ? "" : (asset.askingPriceCents / 100).toFixed(2),
      closingSast: asset.closesAt ? toSastInput(asset.closesAt) : "", status: asset.status,
      portfolioId: asset.portfolioId ?? "",
    } : empty);
    setImages(asset?.images ?? []);
    setCover(Math.max(0, asset?.images.findIndex((image) => image.cover) ?? 0));
    setError("");
    setNotice("");
  }

  function update(name: keyof typeof empty, value: string) {
    setDraft((previous) => ({ ...previous, [name]: value,
      ...(name === "category" && !directSaleSubcategoryAllowed(value, previous.subcategory) ? { subcategory: "" } : {}),
    }));
  }

  async function save(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (saveInProgress.current || uploadInProgress.current || deleteInProgress.current) return;
    saveInProgress.current = true;
    setSaving(true);
    setError("");
    setNotice("");
    try {
      const { portfolioId, subcategory, ...assetFields } = draft;
      const classification = !editing || subcategory !== (editing.subcategory ?? "")
        ? { subcategory } : {};
      // Older/unchanged edits omit the field, including retained Archived links.
      const assignment = !editing || portfolioId !== (editing.portfolioId ?? "")
        ? { portfolioId: portfolioId || null } : {};
      const response = await fetch(`/api/admin/direct-sales/assets${editing ? "/" + editing._id : ""}`, {
        method: editing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...assetFields, ...assignment, ...classification, updatedAt: editing?.updatedAt,
          images: images.map((image, index) => ({ ...image, cover: index === cover })) }),
      });
      const result = response.headers.get("content-type")?.includes("application/json")
        ? await response.json().catch(() => null)
        : null;
      if (!result || (response.ok && (typeof result.asset?._id !== "string" ||
          typeof result.asset.slug !== "string" || !Array.isArray(result.asset.images)))) {
        setError(`Save could not be confirmed (HTTP ${response.status}). Check Inventory for this reference before retrying.`);
        return;
      }
      if (!response.ok) {
        setError(typeof result.error === "string" ? result.error : "Save could not be confirmed. Check Inventory before retrying.");
        return;
      }
      const asset: Asset = result.asset;
      setAssets((previous) => previous.some(({ _id }) => _id === asset._id)
        ? previous.map((entry) => entry._id === asset._id ? asset : entry)
        : [asset, ...previous]);
      select(asset);
      setNotice("Direct Sales asset saved.");
    } catch {
      setError("Save could not be confirmed. Check Inventory for this reference before retrying.");
    } finally {
      saveInProgress.current = false;
      setSaving(false);
    }
  }

  async function deleteAsset(asset: Asset) {
    if (saveInProgress.current || uploadInProgress.current || deleteInProgress.current) return;
    if (!window.confirm(`Permanently delete ${asset.referenceNumber} · ${asset.title}? This cannot be undone.`)) return;

    deleteInProgress.current = true;
    setDeleting(true);
    setError("");
    setNotice("");
    try {
      const response = await fetch(`/api/admin/direct-sales/assets/${asset._id}`, { method: "DELETE" });
      const result = await response.json().catch(() => null);
      if (!response.ok || result?.deletedId !== asset._id) {
        setError(typeof result?.error === "string" ? result.error :
          "Deletion could not be confirmed. Check Inventory before retrying.");
        return;
      }
      setAssets((previous) => previous.filter(({ _id }) => _id !== asset._id));
      if (editing?._id === asset._id) select(null);
      setNotice(`Deleted ${asset.referenceNumber}.`);

      try {
        const inventory = await fetch("/api/admin/direct-sales/assets", { cache: "no-store" });
        const updated = await inventory.json();
        if (!inventory.ok || !Array.isArray(updated?.assets)) throw new Error();
        setAssets(updated.assets);
      } catch {
        setError("The asset was deleted, but Inventory could not be refreshed. Reload to see the latest list.");
      }
    } catch {
      setError("Deletion could not be confirmed. Check Inventory before retrying.");
    } finally {
      deleteInProgress.current = false;
      setDeleting(false);
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
      <label className="mt-3 block">Filter inventory by Sales Portfolio
        <select aria-label="Filter inventory by Sales Portfolio" className={field} value={portfolioFilter} onChange={event => setPortfolioFilter(event.target.value)}>
          <option value="">All Sales Portfolios and Unassigned</option>
          <option value="unassigned">Unassigned</option>
          {portfolios.map(portfolio => <option key={portfolio.id} value={portfolio.id}>{portfolioLabel(portfolio.id)}</option>)}
          {unknownPortfolios.map(id => <option key={id} value={id}>{portfolioLabel(id)}</option>)}
        </select>
      </label>
      <p className="mt-2 text-sm">Asset status controls its publication. Hiding or archiving a Sales Portfolio does not remove its individual assets from the main Direct Sales catalogue.</p>
      {portfolioError && <p role="alert" className="text-red-800">{portfolioError}</p>}
      <button type="button" className="mt-2 underline disabled:opacity-50" disabled={busy || portfoliosLoading}
        onClick={() => setPortfolioRefresh(value => value + 1)}>{portfoliosLoading ? "Loading Sales Portfolios…" : "Refresh Sales Portfolio choices"}</button>
      {loading ? <p>Loading assets…</p> : !assets.length && <p>No Direct Sales assets yet.</p>}
      {!loading && assets.length > 0 && visibleAssets.length === 0 && <p>No assets match this Sales Portfolio filter.</p>}
      <ul className="mt-3 divide-y">
        {visibleAssets.map((asset) => <li key={asset._id} className="flex flex-wrap items-center justify-between gap-2 py-3">
          <span>{asset.referenceNumber} · {asset.title} · {asset.status}<span className="block text-sm">Sales Portfolio: {portfolioLabel(asset.portfolioId)}</span></span>
          <div className="flex gap-4">
            <button type="button" className="underline disabled:opacity-50" disabled={busy} onClick={() => select(asset)}>Edit</button>
            <button type="button" className="text-red-800 underline disabled:opacity-50" disabled={busy}
              aria-label={`Delete ${asset.referenceNumber}`} onClick={() => deleteAsset(asset)}>Delete</button>
          </div>
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
        <label>Subcategory (optional)<select className={field} value={draft.subcategory}
          disabled={!directSaleCategories.find(category => category.slug === draft.category)?.subcategories.length}
          onChange={event => update("subcategory", event.target.value)}>
          <option value="">No subcategory</option>
          {draft.subcategory && !directSaleSubcategoryAllowed(draft.category, draft.subcategory) &&
            <option value={draft.subcategory} disabled>{draft.subcategory} (existing)</option>}
          {directSaleCategories.find(category => category.slug === draft.category)?.subcategories.map(subcategory =>
            <option key={subcategory.slug} value={subcategory.slug}>{subcategory.name}</option>)}
        </select></label>
        <label>Status<select className={field} value={draft.status} onChange={(e) => update("status", e.target.value)}>
          {assetStatuses.map((status) => <option key={status}>{status}</option>)}
        </select></label>
        <label>Sales Portfolio<select aria-label="Asset Sales Portfolio" className={field} value={draft.portfolioId}
          disabled={portfoliosLoading || Boolean(portfolioError)} onChange={event => update("portfolioId", event.target.value)}>
          <option value="">Unassigned</option>
          {portfolios.map(portfolio => <option key={portfolio.id} value={portfolio.id} disabled={portfolio.status === "Archived"}>{portfolioLabel(portfolio.id)}</option>)}
          {draft.portfolioId && !portfolios.some(choice => choice.id === draft.portfolioId) &&
            <option value={draft.portfolioId} disabled>{portfolioLabel(draft.portfolioId)}</option>}
        </select><span className="block text-sm">Archived Sales Portfolios cannot receive assignments. An existing archived assignment can be retained or cleared.</span></label>
        <label>Location<input className={field} value={draft.location} onChange={(e) => update("location", e.target.value)} maxLength={120} /></label>
        <label>Asking price (ZAR, optional)<input className={field} inputMode="decimal" value={draft.askingPrice} onChange={(e) => update("askingPrice", e.target.value)} maxLength={15} /></label>
        <label>Offer closing time (SAST, optional)<input className={field} type="datetime-local" value={draft.closingSast} onChange={(e) => update("closingSast", e.target.value)} /></label>
        <label className="sm:col-span-2">Description<textarea className={field} value={draft.description} onChange={(e) => update("description", e.target.value)} maxLength={6000} rows={4} /></label>
        <label className="sm:col-span-2">Specifications<textarea className={field} value={draft.specifications} onChange={(e) => update("specifications", e.target.value)} maxLength={6000} rows={4} /></label>
      </fieldset>
      <fieldset disabled={busy}>
        <ImageUploader images={images} setImages={setImages} coverImage={cover} setCoverImage={setCover}
          maxImages={directSalePhotoLimit} limitMessage={directSalePhotoLimitMessage}
          disabled={saving || deleting} uploadUrl="/api/admin/direct-sales/upload" onUploadChange={(value) => {
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
