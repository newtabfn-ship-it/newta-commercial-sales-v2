import { NextResponse } from "next/server";
import { directSaleCategories, assetStatuses, parseSastClosing, randToCents } from "@/lib/directSales";

export function privateJson(body: unknown, status = 200) {
  return NextResponse.json(body, { status, headers: { "Cache-Control": "private, no-store" } });
}

export const isObjectId = (value: unknown): value is string =>
  typeof value === "string" && /^[a-f0-9]{24}$/i.test(value);

export async function readBody(request: Request, limit: number) {
  if (!request.body || Number(request.headers.get("content-length")) > limit) return null;
  const reader = request.body.getReader();
  try {
    const chunks: Uint8Array[] = [];
    let size = 0;
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > limit) {
        void reader.cancel().catch(() => {});
        return null;
      }
      chunks.push(value);
    }
    const bytes = new Uint8Array(size);
    let offset = 0;
    for (const chunk of chunks) {
      bytes.set(chunk, offset);
      offset += chunk.byteLength;
    }
    return bytes;
  } catch {
    return null;
  } finally {
    reader.releaseLock();
  }
}

export async function readJson(request: Request, limit: number): Promise<Record<string, unknown> | null> {
  if (request.headers.get("content-type")?.split(";")[0].trim().toLowerCase() !== "application/json") return null;
  const bytes = await readBody(request, limit);
  if (!bytes) return null;
  try {
    const data = JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(bytes));
    return data && typeof data === "object" && !Array.isArray(data) ? data : null;
  } catch { return null; }
}

export function boundedText(value: unknown, max: number): string | null {
  return typeof value === "string" && value.length <= max ? value.trim() : null;
}

export function assetInput(body: Record<string, unknown> | null) {
  if (!body) return null;
  const title = boundedText(body.title, 150);
  const referenceNumber = boundedText(body.referenceNumber, 60);
  const category = directSaleCategories.find(({ slug }) => slug === body.category)?.slug;
  const status = assetStatuses.find((value) => value === body.status);
  const description = boundedText(body.description ?? "", 6000);
  const specifications = boundedText(body.specifications ?? "", 6000);
  const location = boundedText(body.location ?? "", 120);
  const closing = boundedText(body.closingSast ?? "", 16);
  const price = boundedText(body.askingPrice ?? "", 15);
  if (!title || !referenceNumber || !category || !status ||
      [description, specifications, location, closing, price].some((value) => value === null)) return null;
  const closesAt = closing ? parseSastClosing(closing) : null;
  const askingPriceCents = price ? randToCents(price) : null;
  if ((closing && !closesAt) || (price && askingPriceCents === null)) return null;
  if (!Array.isArray(body.images) || body.images.length > 20) return null;
  const images: { url: string; publicId: string; cover: boolean }[] = [];
  for (const image of body.images) {
    if (!image || typeof image !== "object") return null;
    const url = boundedText(image.url, 1000);
    const publicId = boundedText(image.publicId, 300);
    if (!url || !publicId?.startsWith("newta/direct-sales/") || typeof image.cover !== "boolean") return null;
    try {
      const parsed = new URL(url);
      const cloud = process.env.CLOUDINARY_CLOUD_NAME;
      if (!cloud || parsed.origin !== "https://res.cloudinary.com" || parsed.username || parsed.password ||
          parsed.search || parsed.hash ||
          !parsed.pathname.startsWith(`/${cloud}/image/upload/`) ||
          !parsed.pathname.match(/\/image\/upload\/(?:v\d+\/)?newta\/direct-sales\//)) return null;
      const storedId = decodeURIComponent(parsed.pathname).replace(/^.*\/image\/upload\/(?:v\d+\/)?/, "").replace(/\.[^.\/]+$/, "");
      if (storedId !== publicId || images.some((entry) => entry.publicId === publicId)) return null;
    } catch { return null; }
    images.push({ url, publicId, cover: image.cover });
  }
  if (images.length && images.filter(({ cover }) => cover).length !== 1) return null;
  return { title, referenceNumber, category, status, description: description!, specifications: specifications!,
    location: location!, closesAt, askingPriceCents, images };
}

export function isDuplicateKey(error: unknown) {
  return Boolean(error && typeof error === "object" && "code" in error && error.code === 11000);
}
