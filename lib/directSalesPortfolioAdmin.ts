import { directSalesMutationOriginAllowed } from "@/lib/directSalesApi";
import { privateJson, readJson, isDuplicateKey, isObjectId } from "@/lib/directSalesApi";
import { requireEnquiryAdmin } from "@/lib/requireEnquiryAdmin";
import { directSalesSaveModels } from "@/lib/directSalesSaveDb";

export class PortfolioApiError extends Error {
  constructor(public status: number, message: string) { super(message); }
}

// Every route uses the existing session helper and rechecks the current account.
export async function portfolioAdminRequest(request: Request, run: () => Promise<Response>) {
  try {
    const denied = await requireEnquiryAdmin(async id => {
      const { users } = await directSalesSaveModels();
      return users.findById(id).select("role active").maxTimeMS(5000).lean<{ role?: unknown; active?: unknown } | null>();
    });
    if (denied) {
      denied.headers.set("Cache-Control", "private, no-store");
      return denied;
    }
    if (request.method !== "GET" && !directSalesMutationOriginAllowed(request)) {
      return privateJson({ error: "Forbidden origin." }, 403);
    }
    return await run();
  } catch (error) {
    if (error instanceof PortfolioApiError) return privateJson({ error: error.message }, error.status);
    if (isDuplicateKey(error)) return privateJson({ error: "Slug or Sales Portfolio ownership conflict. Reload before retrying." }, 409);
    // Never log raw database errors or client contact information.
    console.error("Direct Sales Portfolio operation failed.");
    return privateJson({ error: "Sales Portfolio service unavailable. Reload to check the outcome before retrying." }, 503);
  }
}

export async function portfolioBody(request: Request, keys: readonly string[]) {
  const body = await readJson(request, 32768);
  if (!body || Object.keys(body).some(key => !keys.includes(key))) {
    throw new PortfolioApiError(400, "Invalid or unauthorized fields.");
  }
  return body;
}

export function portfolioId(id: string) {
  if (!isObjectId(id)) throw new PortfolioApiError(400, "Invalid identifier.");
  return id.toLowerCase();
}

export function expectedVersion(value: unknown): number {
  if (typeof value !== "number" || !Number.isSafeInteger(value) || value < 0 || value >= Number.MAX_SAFE_INTEGER) {
    throw new PortfolioApiError(400, "A valid version is required.");
  }
  return value;
}

export function listPage(request: Request) {
  const params = new URL(request.url).searchParams;
  const value = params.get("page") ?? "1";
  if (!/^[1-9]\d{0,3}$/.test(value)) throw new PortfolioApiError(400, "Invalid page.");
  return Number(value);
}
