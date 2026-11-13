"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { formatRand, offerStatuses } from "@/lib/directSales";

type Summary = { _id: string; assetId: string; assetReference: string; assetTitle: string; amountCents: number; status: string; createdAt: string };
type Offer = Summary & { buyerName: string; phone: string; email: string; message: string;
  internalNotes: string; updatedAt: string; askingPriceCents: number | null };
const initialFilters = { status: "", assetId: "", from: "", to: "" };
const field = "mt-1 w-full rounded border border-gray-300 bg-white p-2";
const formatDate = (value: string) => new Intl.DateTimeFormat("en-ZA", {
  dateStyle: "medium", timeStyle: "short", timeZone: "Africa/Johannesburg",
}).format(new Date(value));

export default function OfferInbox() {
  const [filters, setFilters] = useState(initialFilters);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [offers, setOffers] = useState<Summary[]>([]);
  const [newCount, setNewCount] = useState<number | null>(null);
  const [hasNext, setHasNext] = useState(false);
  const [selected, setSelected] = useState("");
  const [offer, setOffer] = useState<Offer | null>(null);
  const [status, setStatus] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [revision, setRevision] = useState(0);
  const [listError, setListError] = useState("");
  const [detailError, setDetailError] = useState("");
  const [notice, setNotice] = useState("");
  const [assets, setAssets] = useState<{ _id: string; title: string; referenceNumber: string }[]>([]);

  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/admin/direct-sales/assets", { signal: controller.signal, cache: "no-store" })
      .then(async (response) => { if (response.ok) setAssets((await response.json()).assets); })
      .catch(() => {});
    return () => controller.abort();
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    const params = new URLSearchParams(query);
    params.set("page", String(page));
    setLoading(true);
    setListError("");
    fetch(`/api/admin/direct-sales/offers?${params}`, { signal: controller.signal, cache: "no-store" })
      .then(async (response) => {
        const result = await response.json();
        if (controller.signal.aborted) return;
        if (!response.ok) throw new Error(result.error ?? "Could not load offers.");
        setOffers(result.offers);
        setNewCount(result.newCount);
        setHasNext(result.hasNext);
      })
      .catch((failure) => { if (!controller.signal.aborted) setListError(failure.message); })
      .finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, [query, page, revision]);

  useEffect(() => {
    if (!selected) return;
    const controller = new AbortController();
    fetch(`/api/admin/direct-sales/offers/${selected}`, { signal: controller.signal, cache: "no-store" })
      .then(async (response) => {
        const result = await response.json();
        if (controller.signal.aborted) return;
        if (!response.ok) throw new Error(result.error ?? "Could not load this offer.");
        setOffer(result.offer);
        setStatus(result.offer.status);
        setNotes(result.offer.internalNotes);
      })
      .catch((failure) => { if (!controller.signal.aborted) setDetailError(failure.message); });
    return () => controller.abort();
  }, [selected]);

  function select(id: string) {
    setOffer(null);
    setDetailError("");
    setNotice("");
    setSelected(id);
  }

  async function save(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!offer || saving) return;
    setSaving(true);
    setDetailError("");
    setNotice("");
    try {
      const response = await fetch(`/api/admin/direct-sales/offers/${offer._id}`, {
        method: "PATCH", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, internalNotes: notes, updatedAt: offer.updatedAt }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error ?? "Could not update this offer.");
      setOffer(result.offer);
      setStatus(result.offer.status);
      setNotes(result.offer.internalNotes);
      setRevision((value) => value + 1);
      setNotice("Offer updated.");
    } catch (failure) {
      setDetailError(failure instanceof Error ? failure.message : "Could not update this offer.");
    } finally { setSaving(false); }
  }

  return <main className="space-y-6">
    <h1 className="text-3xl font-bold text-[#0B2F24]">Direct Sales Offers</h1>
    <p className="font-semibold" aria-live="polite">New offers: {newCount ?? "—"}</p>
    <Link href="/admin/direct-sales" className="underline">Manage Direct Sales Assets</Link>
    <form className="grid gap-3 rounded-xl bg-white p-5 sm:grid-cols-2 lg:grid-cols-4" onSubmit={(event) => {
      event.preventDefault();
      setPage(1);
      setQuery(new URLSearchParams(Object.entries(filters).filter(([, value]) => value)).toString());
      setRevision((value) => value + 1);
    }}>
      <label>Status<select className={field} value={filters.status} onChange={(e) => setFilters({ ...filters, status: e.target.value })}>
        <option value="">All statuses</option>{offerStatuses.map((value) => <option key={value}>{value}</option>)}
      </select></label>
      <label>Asset<select className={field} value={filters.assetId} onChange={(e) => setFilters({ ...filters, assetId: e.target.value })}>
        <option value="">All assets</option>
        {assets.map(({ _id, referenceNumber, title }) => <option key={_id} value={_id}>{referenceNumber} · {title}</option>)}
      </select></label>
      <label>From (SAST)<input className={field} type="date" value={filters.from} onChange={(e) => setFilters({ ...filters, from: e.target.value })} /></label>
      <label>To (SAST)<input className={field} type="date" value={filters.to} onChange={(e) => setFilters({ ...filters, to: e.target.value })} /></label>
      <button className="rounded bg-[#0B2F24] px-4 py-2 font-semibold text-white">Apply filters</button>
    </form>
    <section aria-label="Received offers" className="rounded-xl bg-white p-5">
      {listError && <p role="alert" className="text-red-800">{listError}</p>}
      {loading ? <p>Loading offers…</p> : !listError && !offers.length && <p>No offers match these filters.</p>}
      {!listError && <ul className="divide-y">
        {offers.map((item) => <li key={item._id} className="flex flex-wrap items-center justify-between gap-3 py-3">
          <span>{item.assetReference} · {item.assetTitle} · {formatRand(item.amountCents)} · {item.status} · {formatDate(item.createdAt)}</span>
          <button type="button" disabled={saving || selected === item._id} className="underline disabled:opacity-50" onClick={() => select(item._id)}>Review offer</button>
        </li>)}
      </ul>}
      <div className="mt-4 flex gap-4">
        {page > 1 && <button type="button" onClick={() => setPage(page - 1)} className="underline">Previous page</button>}
        {hasNext && page < 1000 && <button type="button" onClick={() => setPage(page + 1)} className="underline">Next page</button>}
      </div>
    </section>
    {selected && <section aria-label="Private offer details" className="space-y-4 rounded-xl bg-white p-5">
      <div className="flex justify-between gap-3"><h2 className="text-xl font-bold">Private offer details</h2>
        <button type="button" disabled={saving} onClick={() => select("")} className="underline">Close details</button></div>
      {detailError && <p role="alert" className="text-red-800">{detailError}</p>}
      {notice && <p role="status" className="text-green-900">{notice}</p>}
      {!offer && !detailError && <p>Loading offer…</p>}
      {offer && <>
        <p>{offer.assetReference} · {offer.assetTitle}</p>
        <p className="font-bold">Offered: {formatRand(offer.amountCents)}</p>
        {offer.askingPriceCents != null && <p>Asking price at submission: {formatRand(offer.askingPriceCents)}</p>}
        <p>{offer.buyerName}</p>
        <p>{offer.phone} · {offer.email}</p>
        {offer.message && <p className="whitespace-pre-wrap">{offer.message}</p>}
        <form onSubmit={save} className="space-y-4">
          <fieldset disabled={saving} className="grid gap-4">
            <label>Status<select className={field} value={status} onChange={(e) => setStatus(e.target.value)}>
              {offerStatuses.map((value) => <option key={value}>{value}</option>)}
            </select></label>
            <label>Private internal notes<textarea className={field} rows={4} maxLength={4000} value={notes} onChange={(e) => setNotes(e.target.value)} /></label>
          </fieldset>
          <p className="text-sm text-gray-700">Changing the offer status does not reserve or sell the asset. Contact the buyer separately.</p>
          <button disabled={saving} className="rounded bg-[#D4AF37] px-4 py-2 font-bold disabled:opacity-50">{saving ? "Saving…" : "Save review"}</button>
        </form>
      </>}
    </section>}
  </main>;
}
