import { directSalePhotoLimit, directSalePhotoLimitMessage, directSaleAssetBodyLimit } from "@/lib/directSales";
import { directSalesMutationOriginAllowed } from "@/lib/directSalesApi";
import { directSalesSaveModels } from "@/lib/directSalesSaveDb";
import { requireEnquiryAdmin } from "@/lib/requireEnquiryAdmin";
import { assetInput, boundedText, isDuplicateKey, isObjectId, privateJson, readJson } from "@/lib/directSalesApi";
import { saveAssetWithPortfolio } from "@/lib/directSalesAssetPortfolios";
import { PortfolioApiError } from "@/lib/directSalesPortfolioAdmin";

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const denied = await requireEnquiryAdmin(async id => {
    const { users } = await directSalesSaveModels();
    return users.findById(id).select("role active").maxTimeMS(5000).lean<{ role?: unknown; active?: unknown }>();
  });
  if (denied) return denied;
  if (!directSalesMutationOriginAllowed(request)) {
    return privateJson({ error: "Forbidden." }, 403);
  }
  const { id } = await params;
  if (!isObjectId(id)) return privateJson({ error: "Asset not found." }, 404);
  const body = await readJson(request, directSaleAssetBodyLimit);
  if (Array.isArray(body?.images) && body.images.length > directSalePhotoLimit) {
    return privateJson({ error: directSalePhotoLimitMessage }, 400);
  }
  const input = assetInput(body);
  const version = boundedText(body?.updatedAt, 40);
  if (!input || !version || !Number.isFinite(Date.parse(version))) {
    return privateJson({ error: "Check the asset details, price, closing time and photos." }, 400);
  }
  try {
    const asset = await saveAssetWithPortfolio(input, { id, updatedAt: new Date(version) });
    return privateJson({ asset });
  } catch (error) {
    if (error instanceof PortfolioApiError) return privateJson({ error: error.message }, error.status);
    return isDuplicateKey(error)
      ? privateJson({ error: "That asset reference already exists." }, 409)
      : privateJson({ error: "Save could not be confirmed. Check Inventory before retrying." }, 503);
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!directSalesMutationOriginAllowed(request)) {
    return privateJson({ error: "Forbidden." }, 403);
  }
  const denied = await requireEnquiryAdmin();
  if (denied) return denied;
  const { id } = await params;
  if (!isObjectId(id)) return privateJson({ error: "Asset not found." }, 404);

  try {
    const { assets } = await directSalesSaveModels();
    const result = await assets.deleteOne({ _id: id });
    if (!result.acknowledged) {
      return privateJson({ error: "Deletion could not be confirmed. Check Inventory before retrying." }, 503);
    }
    if (result.deletedCount === 0) return privateJson({ error: "Asset not found." }, 404);
    return privateJson({ deletedId: id }, 200);
  } catch {
    return privateJson({ error: "Deletion could not be confirmed. Check Inventory before retrying." }, 503);
  }
}
