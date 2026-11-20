"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { portfolioLimits } from "@/lib/directSalesPortfolios";

type Client = {
  id: string; version: number; name: string; email: string; phone: string;
  internalNotes: string; portfolioIds: string[];
};
type Portfolio = { id: string; title: string; slug: string; status: string };
const empty = { name: "", email: "", phone: "", internalNotes: "", portfolioIds: [] as string[] };
const field = "mt-1 w-full rounded-lg border border-gray-300 bg-white p-2.5";
const button = "rounded-lg border border-[#0B2F24] px-3 py-2 text-sm disabled:opacity-50";
const base = "/api/admin/direct-sales/clients";

async function jsonRequest(url: string, options: RequestInit = {}) {
  const response = await fetch(url, { ...options, cache: "no-store", credentials: "same-origin" });
  const data = response.headers.get("content-type")?.includes("application/json")
    ? await response.json().catch(() => null) : null;
  if (!response.ok || !data) {
    const error = typeof data?.error === "string" ? data.error.slice(0, 300) : "Request could not be confirmed. Check the saved list before retrying.";
    throw new Error(response.status === 409 ? error + " Your entries are preserved. Reload the saved version to review ownership and version conflicts." : error);
  }
  return data;
}

export default function ClientManager() {
  const [clients, setClients] = useState<Client[]>([]);
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [refresh, setRefresh] = useState(0);
  const [optionPage, setOptionPage] = useState(1);
  const [moreOptions, setMoreOptions] = useState(false);
  const [optionsLoading, setOptionsLoading] = useState(true);
  const [optionError, setOptionError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Client | null>(null);
  const [draft, setDraft] = useState(empty);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const inFlight = useRef(false);
  const initial = editing ? {
    name: editing.name, email: editing.email, phone: editing.phone,
    internalNotes: editing.internalNotes, portfolioIds: editing.portfolioIds,
  } : empty;
  const dirty = JSON.stringify(initial) !== JSON.stringify(draft);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    jsonRequest(base + "?page=" + page, { signal: controller.signal })
      .then(data => { if (!controller.signal.aborted) { setClients(data.clients); setHasMore(data.hasMore); } })
      .catch(failure => { if (!controller.signal.aborted) { setClients([]); setHasMore(false); setError(failure.message); } })
      .finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, [page, refresh]);

  useEffect(() => {
    const controller = new AbortController();
    setOptionsLoading(true);
    setOptionError(false);
    jsonRequest("/api/admin/direct-sales/portfolios?page=" + optionPage, { signal: controller.signal })
      .then(data => {
        if (controller.signal.aborted) return;
        setPortfolios(previous => [...new Map<string, Portfolio>([...previous, ...data.portfolios].map(portfolio => [portfolio.id, portfolio])).values()]);
        setMoreOptions(data.hasMore);
      })
      .catch(failure => { if (!controller.signal.aborted) { setOptionError(true); setError(failure.message); } })
      .finally(() => { if (!controller.signal.aborted) setOptionsLoading(false); });
    return () => controller.abort();
  }, [optionPage, refresh]);

  function select(client: Client | null, confirmed = false) {
    if (inFlight.current || (!confirmed && dirty && !window.confirm("Discard unsaved private client changes?"))) return;
    setEditing(client);
    setDraft(client ? { name: client.name, email: client.email, phone: client.phone,
      internalNotes: client.internalNotes, portfolioIds: [...client.portfolioIds] } : empty);
    setError(""); setNotice("");
  }
  function update(name: "name" | "email" | "phone" | "internalNotes", value: string) {
    setDraft(previous => ({ ...previous, [name]: value }));
  }
  function toggle(id: string, checked: boolean) {
    setDraft(previous => ({ ...previous, portfolioIds: checked
      ? [...new Set([...previous.portfolioIds, id])].slice(0, portfolioLimits.clientPortfolios)
      : previous.portfolioIds.filter(value => value !== id) }));
  }
  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (inFlight.current) return;
    inFlight.current = true; setBusy(true); setError(""); setNotice("");
    try {
      const data = await jsonRequest(base + (editing ? "/" + editing.id : ""), {
        method: editing ? "PATCH" : "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editing ? { ...draft, version: editing.version } : draft),
      });
      if (!data.client?.id || !Number.isSafeInteger(data.client.version)) throw new Error("Save could not be confirmed. Check the saved client list before retrying.");
      setEditing(data.client);
      setDraft({ name: data.client.name, email: data.client.email, phone: data.client.phone,
        internalNotes: data.client.internalNotes, portfolioIds: [...data.client.portfolioIds] });
      setNotice("Private client and Sales Portfolio associations saved. Public titles and asset publication are unchanged.");
      setRefresh(value => value + 1);
    } catch (failure) {
      setError(failure instanceof Error ? failure.message : "Save could not be confirmed. Entries are preserved; check the client list before retrying.");
    } finally { inFlight.current = false; setBusy(false); }
  }
  async function reloadSaved() {
    if (!editing || inFlight.current || !window.confirm("Reload the saved private client and discard your unsaved entries?")) return;
    inFlight.current = true; setBusy(true);
    try {
      const data = await jsonRequest(base + "/" + editing.id);
      inFlight.current = false; select(data.client, true);
    } catch (failure) { setError(failure instanceof Error ? failure.message : "Could not reload client."); }
    finally { inFlight.current = false; setBusy(false); }
  }
  const portfolioLabel = (id: string) => portfolios.find(portfolio => portfolio.id === id)?.title ?? "Sales Portfolio ID: " + id;

  return <section className="min-w-0 space-y-5 text-[#0B2F24]">
    <h1 className="text-2xl font-bold">Direct Sales Clients (Private)</h1>
    <p className="rounded-lg border border-[#D4AF37] bg-amber-50 p-4">
      ADMIN PRIVATE — client names, contact information and notes are for authorised administrators only.
      Client details are never copied into public Sales Portfolio titles. One client may own multiple Sales Portfolios; each Sales Portfolio may have only one client.
    </p>
    {error && <p role="alert" className="rounded-lg bg-red-50 p-3 text-red-800">{error}</p>}
    {notice && <p role="status" className="rounded-lg bg-green-50 p-3">{notice}</p>}
    <div className="grid min-w-0 gap-6 xl:grid-cols-2">
      <div className="min-w-0 space-y-3">
        <div className="flex flex-wrap gap-2">
          <button type="button" className={button} disabled={busy} onClick={() => select(null)}>New private client</button>
          <button type="button" className={button} disabled={loading || busy} onClick={() => { setError(""); setRefresh(value => value + 1); }}>Refresh lists</button>
        </div>
        {loading ? <p role="status">Loading private clients…</p> : clients.length === 0 ? <p>No clients on this page.</p> :
          <ul className="space-y-3">{clients.map(client => <li key={client.id} className="break-words rounded-lg border bg-white p-4">
            <h2 className="font-bold">{client.name}</h2>
            <p className="text-xs font-bold">ADMIN PRIVATE</p>
            <p>{client.email}</p><p>{client.phone}</p>
            <p className="mt-2 text-sm">Sales Portfolios: {client.portfolioIds.length ? client.portfolioIds.map(portfolioLabel).join("; ") : "None assigned"}</p>
            <button type="button" className={button + " mt-2"} disabled={busy} onClick={() => select(client)}>Edit private client</button>
          </li>)}</ul>}
        <div className="flex flex-wrap items-center gap-3">
          <button type="button" className={button} disabled={page === 1 || loading || busy} onClick={() => setPage(value => value - 1)}>Previous</button>
          <span>Page {page}</span>
          <button type="button" className={button} disabled={!hasMore || loading || busy} onClick={() => setPage(value => value + 1)}>Next</button>
        </div>
      </div>
      <form onSubmit={save} className="min-w-0 space-y-4 rounded-xl border bg-white p-4 sm:p-6">
        <h2 className="text-xl font-bold">{editing ? "Edit private client" : "Create private client"}</h2>
        <fieldset disabled={busy} className="min-w-0 space-y-4">
          <label className="block">Client name — ADMIN PRIVATE
            <input name="name" className={field} required maxLength={portfolioLimits.clientName} value={draft.name} onChange={event => update("name", event.target.value)} />
          </label>
          <label className="block">Email — ADMIN PRIVATE
            <input name="email" type="email" className={field} maxLength={portfolioLimits.email} value={draft.email} onChange={event => update("email", event.target.value)} />
          </label>
          <label className="block">Contact number — ADMIN PRIVATE
            <input name="phone" type="tel" className={field} maxLength={portfolioLimits.phone} value={draft.phone} onChange={event => update("phone", event.target.value)} />
          </label>
          <label className="block">Internal notes — ADMIN PRIVATE
            <textarea name="internalNotes" className={field} rows={4} maxLength={portfolioLimits.internalNotes} value={draft.internalNotes} onChange={event => update("internalNotes", event.target.value)} />
          </label>
          <fieldset className="min-w-0 space-y-2 rounded-lg border p-3">
            <legend className="px-1 font-bold">Sales Portfolio associations — ADMIN PRIVATE</legend>
            <p className="text-sm">Server-side checks reject ownership conflicts. Existing selections stay selected when more choices are loaded. Maximum {portfolioLimits.clientPortfolios} Sales Portfolios per client.</p>
            {draft.portfolioIds.length > 0 && <ul className="space-y-1">{draft.portfolioIds.map(id => <li key={id} className="break-words text-sm">
              {portfolioLabel(id)} <button type="button" className="underline" aria-label={"Remove Sales Portfolio " + portfolioLabel(id)} onClick={() => toggle(id, false)}>Remove</button>
            </li>)}</ul>}
            <div className="max-h-64 space-y-2 overflow-y-auto">
              {portfolios.map(portfolio => <label key={portfolio.id} className="flex items-start gap-2 break-words">
                <input type="checkbox" name="portfolioIds" value={portfolio.id} checked={draft.portfolioIds.includes(portfolio.id)}
                  disabled={!draft.portfolioIds.includes(portfolio.id) && draft.portfolioIds.length >= portfolioLimits.clientPortfolios}
                  onChange={event => toggle(portfolio.id, event.target.checked)} />
                <span className="min-w-0">{portfolio.title} — {portfolio.status === "Archived" ? "Archived (not active stock)" : portfolio.status}<span className="block text-xs">{portfolio.slug}</span></span>
              </label>)}
            </div>
            {optionsLoading && <p role="status">Loading Sales Portfolio choices…</p>}
            {!optionsLoading && portfolios.length === 0 && <p>No Sales Portfolio choices loaded. Create Sales Portfolios first, or refresh if loading failed.</p>}
            {(moreOptions || optionError) && <button type="button" className={button} disabled={optionsLoading || busy} onClick={() => {
              if (optionError) { setError(""); setRefresh(value => value + 1); }
              else setOptionPage(value => value + 1);
            }}>{optionError ? "Retry Sales Portfolio choices" : "Load more Sales Portfolios"}</button>}
          </fieldset>
          <button type="submit" className="rounded-lg bg-[#D4AF37] px-5 py-3 font-bold disabled:opacity-50">{busy ? "Saving…" : "Save private client"}</button>
        </fieldset>
        {editing && <button type="button" className={button} disabled={busy} onClick={reloadSaved}>Reload saved version</button>}
      </form>
    </div>
  </section>;
}
