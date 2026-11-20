import { createHash, createHmac } from "node:crypto";
import { isIP } from "node:net";
import { NextResponse } from "next/server";
import { randToCents } from "@/lib/directSales";
import { boundedText, isDuplicateKey, isObjectId, privateJson, readJson } from "@/lib/directSalesApi";
import { PortfolioApiError } from "@/lib/directSalesPortfolioAdmin";
import { offerStore, replayOffer, requireOfferStorage, submitPortfolioOffer, type OfferStore } from "@/lib/directSalesOfferStore";

const windowMs = 10 * 60 * 1000;

async function takeSlot(store: OfferStore, key: string, max: number, bucket: number) {
  try {
    await store.limits.updateOne(
      { _id: `${bucket}:${key}`, count: { $lt: max } },
      { $inc: { count: 1 }, $setOnInsert: { expiresAt: new Date((bucket + 2) * windowMs) } },
      { upsert: true, maxTimeMS: 5000 }
    );
    return true;
  } catch (error) {
    if (isDuplicateKey(error)) return false;
    throw error;
  }
}

export async function POST(request: Request) {
  const body = await readJson(request, 8192);
  const buyerName = boundedText(body?.buyerName, 100);
  const phone = boundedText(body?.phone, 30);
  const email = boundedText(body?.email, 254)?.toLowerCase();
  const message = boundedText(body?.message ?? "", 2000);
  const amountCents = randToCents(body?.amount);
  const assetId = body?.assetId;
  const token = body?.submissionId;
  if (!isObjectId(assetId) || typeof token !== "string" ||
      !/^[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/i.test(token) ||
      !buyerName || !phone || !/^\+?[0-9 ()-]{7,30}$/.test(phone) ||
      phone.replace(/\D/g, "").length < 7 ||
      !email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || message === null || amountCents === null) {
    return privateJson({ error: "Enter valid contact details and an offer amount in rand." }, 400);
  }
  if (body?.website) return privateJson({ error: "Unable to submit the offer." }, 400);

  const normalizedAssetId = assetId.toLowerCase();
  const id = createHash("sha256").update(token.toLowerCase()).digest("hex").slice(0, 24);
  const receipt = () => privateJson({ received: true }, 201);
  const conflict = () => privateJson({ error: "This submission was already used. Start a new offer." }, 409);
  const input = { id, assetId: normalizedAssetId, buyerName, phone, email, message, amountCents };

  try {
    const store = await offerStore();
    const previous = await replayOffer(store, input);
    if (previous) return previous === "received" ? receipt() : conflict();
    await requireOfferStorage(store);

    const bucket = Math.floor(Date.now() / windowMs);
    const ip = process.env.VERCEL === "1" ? request.headers.get("x-vercel-forwarded-for")?.trim() : undefined;
    const secret = process.env.NEXTAUTH_SECRET;
    const client = ip && isIP(ip) && secret
      ? createHmac("sha256", secret).update(ip).digest("hex")
      : "unidentified";
    if (!await takeSlot(store, client, 8, bucket) || !await takeSlot(store, "all", 150, bucket)) {
      return NextResponse.json({ error: "Too many offers. Please try again later." }, {
        status: 429,
        headers: { "Cache-Control": "no-store", "Retry-After": String(Math.max(1, Math.ceil(((bucket + 1) * windowMs - Date.now()) / 1000))) },
      });
    }

    try {
      const result = await submitPortfolioOffer(store, input);
      return result === "received" ? receipt() : conflict();
    } catch (error) {
      // A write can succeed even when its acknowledgement is lost.
      const confirmed = await replayOffer(store, input);
      if (confirmed) return confirmed === "received" ? receipt() : conflict();
      throw error;
    }
  } catch (error) {
    if (error instanceof PortfolioApiError && error.status === 409) {
      return privateJson({ error: "This asset is no longer accepting offers." }, 409);
    }
    return privateJson({ error: "Could not confirm receipt. Retry the same offer." }, 503);
  }
}
