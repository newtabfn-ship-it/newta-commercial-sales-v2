"use client";

import { useRef, useState } from "react";
import { offerTerms } from "@/lib/directSales";

export default function OfferForm({ assetId, reference }: { assetId: string; reference: string }) {
  const pending = useRef<Record<string, string> | null>(null);
  const sending = useRef(false);
  const [busy, setBusy] = useState(false);
  const [uncertain, setUncertain] = useState(false);
  const [received, setReceived] = useState(false);
  const [error, setError] = useState("");

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (sending.current || received) return;
    const form = new FormData(event.currentTarget);
    pending.current ??= {
      assetId,
      submissionId: crypto.randomUUID(),
      buyerName: String(form.get("buyerName") ?? ""),
      phone: String(form.get("phone") ?? ""),
      email: String(form.get("email") ?? ""),
      amount: String(form.get("amount") ?? ""),
      message: String(form.get("message") ?? ""),
      website: String(form.get("website") ?? ""),
    };
    sending.current = true;
    setBusy(true);
    setError("");
    try {
      const response = await fetch("/api/direct-sales/offers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(pending.current),
      });
      const result = await response.json();
      if (response.ok && result.received === true) {
        pending.current = null;
        setReceived(true);
      } else if (response.status === 400 || response.status === 409 || response.status === 429) {
        if (uncertain) {
          setError("Receipt is still unconfirmed. " + (result.error ?? "Retry this same offer."));
        } else {
          pending.current = null;
          setError(result.error ?? "Could not submit the offer.");
        }
      } else {
        throw new Error("Receipt not confirmed");
      }
    } catch {
      setUncertain(true);
      setError("We could not confirm receipt. Retry this same offer before leaving the page.");
    } finally {
      sending.current = false;
      setBusy(false);
    }
  }

  if (received) return <div role="status" className="rounded-xl bg-green-50 p-5 text-green-950">
    <p className="font-bold">Your offer has been received.</p>
    <p className="mt-2">{offerTerms}</p>
  </div>;

  const field = "mt-1 w-full rounded-lg border border-gray-300 bg-white p-3";
  return (
    <form onSubmit={submit} className="space-y-4">
      <h2 className="text-2xl font-bold text-[#0B2F24]">Make an Offer</h2>
      <p>Asset reference: {reference}</p>
      <fieldset disabled={busy || uncertain} className="grid gap-4 sm:grid-cols-2">
        <label>Name<input className={field} name="buyerName" autoComplete="name" required maxLength={100} /></label>
        <label>Phone<input className={field} name="phone" type="tel" autoComplete="tel" required maxLength={30} /></label>
        <label>Email<input className={field} name="email" type="email" autoComplete="email" required maxLength={254} /></label>
        <label>Offer (ZAR)<input className={field} name="amount" inputMode="decimal" pattern="[0-9]{1,10}([.][0-9]{1,2})?" required /></label>
        <label className="sm:col-span-2">Message (optional)<textarea className={field} name="message" maxLength={2000} rows={3} /></label>
        <label hidden>Website<input name="website" tabIndex={-1} autoComplete="off" /></label>
      </fieldset>
      <p className="text-sm text-gray-700">{offerTerms}</p>
      <p className="text-sm text-gray-700">NEWTA uses your contact details to review your offer and contact you about this asset.</p>
      {error && <p role="alert" className="text-red-800">{error}</p>}
      <button disabled={busy} className="rounded-xl bg-[#D4AF37] px-6 py-3 font-bold text-[#0B2F24] disabled:opacity-60">
        {busy ? "Sending…" : uncertain ? "Retry same offer" : "Submit private offer"}
      </button>
    </form>
  );
}
