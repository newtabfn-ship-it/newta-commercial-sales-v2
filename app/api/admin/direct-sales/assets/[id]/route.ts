import connectDB from "@/lib/mongodb";
import { requireEnquiryAdmin } from "@/lib/requireEnquiryAdmin";
import { assetInput, boundedText, isDuplicateKey, isObjectId, privateJson, readJson } from "@/lib/directSalesApi";
import DirectSaleAsset from "@/models/DirectSaleAsset";

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const denied = await requireEnquiryAdmin();
  if (denied) return denied;
  const { id } = await params;
  if (!isObjectId(id)) return privateJson({ error: "Asset not found." }, 404);
  const body = await readJson(request, 64000);
  const input = assetInput(body);
  const version = boundedText(body?.updatedAt, 40);
  if (!input || !version || !Number.isFinite(Date.parse(version))) {
    return privateJson({ error: "Check the asset details, price, closing time and photos." }, 400);
  }
  try {
    await connectDB();
    const existing = await DirectSaleAsset.findById(id).select("closedAt").lean();
    if (!existing) return privateJson({ error: "Asset not found." }, 404);
    const closedAt = input.status === "Closed" || input.status === "Sold"
      ? existing.closedAt ?? new Date()
      : null;
    const asset = await DirectSaleAsset.findOneAndUpdate(
      { _id: id, updatedAt: new Date(version) },
      { $set: { ...input, closedAt } },
      { new: true, runValidators: true }
    );
    return asset ? privateJson({ asset }) : privateJson({ error: "The asset changed. Reload before editing again." }, 409);
  } catch (error) {
    return isDuplicateKey(error)
      ? privateJson({ error: "That asset reference already exists." }, 409)
      : privateJson({ error: "Could not save the Direct Sales asset." }, 503);
  }
}
