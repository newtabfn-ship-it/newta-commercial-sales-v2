"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { portfolioLimits, type PortfolioStatus } from "@/lib/directSalesPortfolios";

type Portfolio = {
  id: string; version: number; title: string; slug: string; status: PortfolioStatus;
  description: string; seoTitle: string; seoDescription: string; sharingImageUrl: string;
};
const empty = { title: "", slug: "", description: "", seoTitle: "", seoDescription: "", sharingImageUrl: "" };
const field = "mt-1 w-full rounded-lg border border-gray-300 bg-white p-2.5";
const button = "rounded-lg border border-[#0B2F24] px-3 py-2 text-sm disabled:opacity-50";
const warning = "Hiding this Sales Portfolio does not withdraw its individual assets from the main Direct Sales catalogue.";
const base = "/api/admin/direct-sales/portfolios";

async function jsonRequest(url: string, options: RequestInit = {}) {
  const response = await fetch(url, { ...options, cache: "no-store", credentials: "same-origin" });
  const data = response.headers.get("content-type")?.includes("application/json")
    ? await response.json().catch(() => null) : null;
  if (!response.ok || !data) {
    const error = typeof data?.error === "string" ? data.error.slice(0, 300) : "Request could not be confirmed. Check the saved list before retrying.";
    throw new Error(response.status === 409 ? error + " Your entries are preserved. Reload the saved version before editing again." : error);
  }
  return data;
}

export default function PortfolioManager() {
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [refresh, setRefresh] = useState(0);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Portfolio | null>(null);
  const [draft, setDraft] = useState(empty);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const inFlight = useRef(false);
  const initial = editing ? {
    title: editing.title, slug: editing.slug, description: editing.description,
    seoTitle: editing.seoTitle, seoDescription: editing.seoDescription, sharingImageUrl: editing.sharingImageUrl ?? "",
  } : empty;
  const dirty = JSON.stringify(initial) !== JSON.stringify(draft);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    jsonRequest(base + "?page=" + page, { signal: controller.signal })
      .then(data => { if (!controller.signal.aborted) { setPortfolios(data.portfolios); setHasMore(data.hasMore); } })
      .catch(failure => { if (!controller.signal.aborted) { setPortfolios([]); setHasMore(false); setError(failure.message); } })
      .finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, [page, refresh]);

  function select(portfolio: Portfolio | null, confirmed = false) {
    if (inFlight.current || (!confirmed && dirty && !window.confirm("Discard unsaved Sales Portfolio changes?"))) return;
    setEditing(portfolio);
    setDraft(portfolio ? {
      title: portfolio.title, slug: portfolio.slug, description: portfolio.description,
      seoTitle: portfolio.seoTitle, seoDescription: portfolio.seoDescription, sharingImageUrl: portfolio.sharingImageUrl ?? "",
    } : empty);
    setError(""); setNotice("");
  }
  function update(name: keyof typeof empty, value: string) {
    setDraft(previous => ({ ...previous, [name]: value }));
  }
  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (inFlight.current) return;
    inFlight.current = true; setBusy(true); setError(""); setNotice("");
    try {
      const { slug, ...editable } = draft;
      const body = editing ? { ...editable, version: editing.version } : { ...draft, status: "Draft" };
      const data = await jsonRequest(base + (editing ? "/" + editing.id : ""), {
        method: editing ? "PATCH" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body),
      });
      if (!data.portfolio?.id || !Number.isSafeInteger(data.portfolio.version)) throw new Error("Save could not be confirmed. Check the saved list before retrying.");
      setEditing(data.portfolio); setDraft({
        title: data.portfolio.title, slug: data.portfolio.slug, description: data.portfolio.description,
        seoTitle: data.portfolio.seoTitle, seoDescription: data.portfolio.seoDescription, sharingImageUrl: data.portfolio.sharingImageUrl ?? "",
      });
      setNotice("Sales Portfolio saved. Draft pages are not public; asset publication is unchanged.");
      setRefresh(value => value + 1);
    } catch (failure) {
      setError(failure instanceof Error ? failure.message : "Save could not be confirmed. Entries are preserved; check the list before retrying.");
    } finally { inFlight.current = false; setBusy(false); }
  }
  async function changeStatus(status: PortfolioStatus) {
    if (!editing || dirty || inFlight.current) return;
    if ((status === "Draft" || status === "Archived") && !window.confirm(warning + "\nContinue?")) return;
    inFlight.current = true; setBusy(true); setError(""); setNotice("");
    try {
      const data = await jsonRequest(base + "/" + editing.id + "/status", {
        method: "PATCH", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, version: editing.version }),
      });
      if (!data.portfolio?.id || !Number.isSafeInteger(data.portfolio.version)) throw new Error("Status change could not be confirmed. Reload the saved version.");
      setEditing(data.portfolio); setNotice("Status saved. Asset publication is unchanged. Only Published Sales Portfolios with eligible stock appear in public discovery.");
      setRefresh(value => value + 1);
    } catch (failure) { setError(failure instanceof Error ? failure.message : "Status change could not be confirmed."); }
    finally { inFlight.current = false; setBusy(false); }
  }
  async function reloadSaved() {
    if (!editing || inFlight.current || !window.confirm("Reload the saved Sales Portfolio and discard your unsaved entries?")) return;
    inFlight.current = true; setBusy(true);
    try {
      const data = await jsonRequest(base + "/" + editing.id);
      inFlight.current = false;
      select(data.portfolio, true);
    } catch (failure) { setError(failure instanceof Error ? failure.message : "Could not reload Sales Portfolio."); }
    finally { inFlight.current = false; setBusy(false); }
  }
  const marketingUrl = editing ? "https://newtacommercialsales.com/direct-sales/portfolios/" + editing.slug : "";
  async function copyLink() {
    try { await navigator.clipboard.writeText(marketingUrl); setNotice("Marketing link copied. Only share after the approved release is deployed."); }
    catch { setError("Clipboard unavailable. You can select and copy the permanent URL shown below."); }
  }

  return <section className="min-w-0 space-y-5 text-[#0B2F24]">
    <h1 className="text-2xl font-bold">Direct Sales Portfolios</h1>
    <p className="rounded-lg border border-[#D4AF37] bg-amber-50 p-4">
      Before sharing marketing links, ensure the approved Sales Portfolios release is deployed. Draft pages are not public.
      Archived pages retain their URL with an archive notice. Only Published Sales Portfolios with eligible stock appear in public discovery.
      Use descriptive public titles; keep client identities and contact details in Direct Sales Clients (Private).
    </p>
    {error && <p role="alert" className="rounded-lg bg-red-50 p-3 text-red-800">{error}</p>}
    {notice && <p role="status" className="rounded-lg bg-green-50 p-3">{notice}</p>}
    <div className="grid min-w-0 gap-6 xl:grid-cols-2">
      <div className="min-w-0 space-y-3">
        <div className="flex flex-wrap gap-2">
          <button type="button" className={button} disabled={busy} onClick={() => select(null)}>New Sales Portfolio</button>
          <button type="button" className={button} disabled={loading || busy} onClick={() => { setError(""); setRefresh(value => value + 1); }}>Refresh list</button>
        </div>
        {loading ? <p role="status">Loading Sales Portfolios…</p> : portfolios.length === 0 ? <p>No Sales Portfolios on this page.</p> :
          <ul className="space-y-3">{portfolios.map(portfolio => <li key={portfolio.id} className="break-words rounded-lg border bg-white p-4">
            <h2 className="font-bold">{portfolio.title}</h2>
            <p>{portfolio.status === "Archived" ? "Archived — not active stock" : portfolio.status}</p>
            <p className="text-sm">Permanent slug: {portfolio.slug}</p>
            <button type="button" className={button + " mt-2"} disabled={busy} onClick={() => select(portfolio)}>Edit Sales Portfolio</button>
          </li>)}</ul>}
        <div className="flex flex-wrap items-center gap-3">
          <button type="button" className={button} disabled={page === 1 || loading || busy} onClick={() => setPage(value => value - 1)}>Previous</button>
          <span>Page {page}</span>
          <button type="button" className={button} disabled={!hasMore || loading || busy} onClick={() => setPage(value => value + 1)}>Next</button>
        </div>
      </div>
      <form onSubmit={save} className="min-w-0 space-y-4 rounded-xl border bg-white p-4 sm:p-6">
        <h2 className="text-xl font-bold">{editing ? "Edit Sales Portfolio" : "Create Draft Sales Portfolio"}</h2>
        <fieldset disabled={busy} className="min-w-0 space-y-4">
          <label className="block">Public Sales Portfolio title
            <input name="title" className={field} required maxLength={portfolioLimits.title} value={draft.title} onChange={event => update("title", event.target.value)} />
          </label>
          <label className="block">Permanent slug {editing ? "(cannot be changed)" : "(choose once)"}
            <input name="slug" className={field} required readOnly={Boolean(editing)} maxLength={portfolioLimits.slug} pattern="[a-z0-9]+(-[a-z0-9]+)*" value={draft.slug} onChange={event => { if (!editing) update("slug", event.target.value); }} />
          </label>
          <label className="block">Public description
            <textarea name="description" className={field} rows={4} maxLength={portfolioLimits.description} value={draft.description} onChange={event => update("description", event.target.value)} />
          </label>
          <label className="block">Portfolio Cover Image URL (optional)
            <input name="sharingImageUrl" type="url" className={field} maxLength={portfolioLimits.sharingImageUrl}
              value={draft.sharingImageUrl} onChange={event => update("sharingImageUrl", event.target.value)} />
            <span className="text-sm">Public HTTPS Cloudinary PNG, JPEG or WebP URL. Independent of asset photographs; no upload is performed.</span>
          </label>
          <label className="block">SEO title (optional)
            <input name="seoTitle" className={field} maxLength={portfolioLimits.seoTitle} value={draft.seoTitle} onChange={event => update("seoTitle", event.target.value)} />
          </label>
          <label className="block">SEO description (optional)
            <textarea name="seoDescription" className={field} rows={3} maxLength={portfolioLimits.seoDescription} value={draft.seoDescription} onChange={event => update("seoDescription", event.target.value)} />
          </label>
          <button type="submit" className="rounded-lg bg-[#D4AF37] px-5 py-3 font-bold disabled:opacity-50">{busy ? "Saving…" : "Save Sales Portfolio"}</button>
        </fieldset>
        {editing && <div className="space-y-3 border-t pt-4">
          <p>Status: <strong>{editing.status}</strong>{editing.status === "Archived" && " — not active stock"}</p>
          {dirty && <p>Save your edits before changing status.</p>}
          <div className="flex flex-wrap gap-2">
            {editing.status !== "Published" && <button type="button" className={button} disabled={busy || dirty} onClick={() => changeStatus("Published")}>Publish</button>}
            {editing.status === "Published" && <button type="button" className={button} disabled={busy || dirty} onClick={() => changeStatus("Draft")}>Unpublish</button>}
            {editing.status === "Archived" && <button type="button" className={button} disabled={busy || dirty} onClick={() => changeStatus("Draft")}>Restore to Draft</button>}
            {editing.status !== "Archived" && <button type="button" className={button} disabled={busy || dirty} onClick={() => changeStatus("Archived")}>Archive</button>}
            <button type="button" className={button} disabled={busy} onClick={reloadSaved}>Reload saved version</button>
          </div>
          <p className="text-sm">{warning} Permanent deletion is disabled.</p>
          {editing.status === "Published" ? <div className="space-y-2">
            <p className="text-sm">Permanent marketing URL (requires approved deployment):</p>
            <input aria-label="Permanent marketing URL" className={field} readOnly value={marketingUrl} />
            <button type="button" className={button} disabled={busy} onClick={copyLink}>Copy Marketing Link</button>
          </div> : <p className="break-words text-sm">{editing.status === "Archived"
            ? "Archived URL retained with an archive notice and no available-stock grid: " + marketingUrl
            : "Draft Sales Portfolio pages are not public."}</p>}
        </div>}
      </form>
    </div>
  </section>;
}
