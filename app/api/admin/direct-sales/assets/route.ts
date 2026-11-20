import { directSalesMutationOriginAllowed } from "@/lib/directSalesApi";
import connectDB from "@/lib/mongodb";
import { requireEnquiryAdmin } from "@/lib/requireEnquiryAdmin";
import { assetInput, isDuplicateKey, privateJson, readJson } from "@/lib/directSalesApi";
import { createEquipmentSlug } from "@/lib/slugify";
import DirectSaleAsset from "@/models/DirectSaleAsset";
import { directSalesSaveModels } from "@/lib/directSalesSaveDb";
import { saveAssetWithPortfolio } from "@/lib/directSalesAssetPortfolios";
import { PortfolioApiError } from "@/lib/directSalesPortfolioAdmin";

export async function GET() {
  const denied = await requireEnquiryAdmin();
  if (denied) return denied;
  try {
    await connectDB();
    const assets = await DirectSaleAsset.find().sort({ createdAt: -1 }).lean();
    return privateJson({ assets });
  } catch {
    return privateJson({ error: "Could not load Direct Sales assets." }, 503);
  }
}

export async function POST(request: Request) {
  const authStarted = Date.now();
  const denied = await requireEnquiryAdmin(async (id) => {
    try {
      const { users } = await directSalesSaveModels();
      return await users.findById(id).select("role active").lean<{ role?: unknown; active?: unknown }>();
    } catch (error) {
      console.error("Direct Sales asset save authorization failed", { elapsedMs: Date.now() - authStarted });
      throw error;
    }
  });
  if (denied) return denied;
  if (!directSalesMutationOriginAllowed(request)) {
    return privateJson({ error: "Forbidden." }, 403);
  }
  const input = assetInput(await readJson(request, 64000));
  if (!input) return privateJson({ error: "Check the asset details, price, closing time and photos." }, 400);
  const slug = createEquipmentSlug(input.title, input.referenceNumber).replace(/^-+|-+$/g, "");
  if (!slug) return privateJson({ error: "Enter a title or reference suitable for a public URL." }, 400);
  let phase = "connect";
  let started = Date.now();
  try {
    phase = "transaction";
    started = Date.now();
    const asset = await saveAssetWithPortfolio(input, { slug });
    return privateJson({ asset }, 201);
  } catch (error) {
    if (error instanceof PortfolioApiError) return privateJson({ error: error.message }, error.status);
    if (isDuplicateKey(error)) {
      return privateJson({ error: "That asset reference or URL already exists. Check Inventory." }, 409);
    }
    const code = error && typeof error === "object" && "code" in error ? error.code : undefined;
    const reason = error instanceof Error && /Timeout|ServerSelection/.test(error.name)
      ? "timeout" : code === 13 ? "unauthorized" : code === 26 ? "missing-collection" : "database-error";
    console.error("Direct Sales asset save failed", { phase, elapsedMs: Date.now() - started, reason });
    return phase === "transaction"
      ? privateJson({ error: "Save could not be confirmed. Check Inventory for this reference before retrying." }, 503)
      : privateJson({ error: "The asset was not saved. Direct Sales storage could not be verified." }, 503);
  }
}
