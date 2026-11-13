import { createHash, createHmac } from "node:crypto";
import { isIP } from "node:net";
import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { acceptsOffers, randToCents } from "@/lib/directSales";
import { boundedText, isDuplicateKey, isObjectId, privateJson, readJson } from "@/lib/directSalesApi";
import DirectSaleAsset from "@/models/DirectSaleAsset";
import DirectSaleOffer from "@/models/DirectSaleOffer";
import DirectSaleOfferLimit from "@/models/DirectSaleOfferLimit";

const windowMs = 10 * 60 * 1000;

async function takeSlot(key: string, max: number, bucket: number) {
  try {
    await DirectSaleOfferLimit.updateOne(
      { _id: `${bucket}:${key}`, count: { $lt: max } },
      { $inc: { count: 1 }, $setOnInsert: { expiresAt: new Date((bucket + 2) * windowMs) } },
      { upsert: true }
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
  async function replay() {
    const existing = await DirectSaleOffer.findById(id)
      .select("assetId buyerName phone email message amountCents").lean();
    if (!existing) return null;
    return String(existing.assetId) === normalizedAssetId && existing.buyerName === buyerName &&
      existing.phone === phone && existing.email === email && existing.message === message &&
      existing.amountCents === amountCents
      ? receipt()
      : privateJson({ error: "This submission was already used. Start a new offer." }, 409);
  }

  try {
    await connectDB();
    const previous = await replay();
    if (previous) return previous;

    const bucket = Math.floor(Date.now() / windowMs);
    const ip = process.env.VERCEL === "1" ? request.headers.get("x-vercel-forwarded-for")?.trim() : undefined;
    const secret = process.env.NEXTAUTH_SECRET;
    const client = ip && isIP(ip) && secret
      ? createHmac("sha256", secret).update(ip).digest("hex")
      : "unidentified";
    if (!await takeSlot(client, 8, bucket) || !await takeSlot("all", 150, bucket)) {
      return NextResponse.json({ error: "Too many offers. Please try again later." }, {
        status: 429,
        headers: { "Cache-Control": "no-store", "Retry-After": String(Math.max(1, Math.ceil(((bucket + 1) * windowMs - Date.now()) / 1000))) },
      });
    }

    const asset = await DirectSaleAsset.findOne({ _id: normalizedAssetId, status: "Published" })
      .select("status closesAt title referenceNumber askingPriceCents").lean();
    if (!asset || !acceptsOffers(asset)) return privateJson({ error: "This asset is no longer accepting offers." }, 409);
    try {
      await DirectSaleOffer.create({
        _id: id,
        assetId: asset._id,
        assetReference: asset.referenceNumber,
        assetTitle: asset.title,
        askingPriceCents: asset.askingPriceCents,
        amountCents, buyerName, phone, email, message,
      });
    } catch (error) {
      // A write can succeed even when its acknowledgement is lost.
      const confirmed = await replay();
      if (confirmed) return confirmed;
      throw error;
    }
    return receipt();
  } catch {
    return privateJson({ error: "Could not confirm receipt. Retry the same offer." }, 503);
  }
}
