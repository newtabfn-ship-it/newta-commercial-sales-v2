import connectDB from "@/lib/mongodb";
import { requireEnquiryAdmin } from "@/lib/requireEnquiryAdmin";
import { assetInput, isDuplicateKey, privateJson, readJson } from "@/lib/directSalesApi";
import { createEquipmentSlug } from "@/lib/slugify";
import DirectSaleAsset from "@/models/DirectSaleAsset";

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
  const denied = await requireEnquiryAdmin();
  if (denied) return denied;
  const input = assetInput(await readJson(request, 64000));
  if (!input) return privateJson({ error: "Check the asset details, price, closing time and photos." }, 400);
  const slug = createEquipmentSlug(input.title, input.referenceNumber).replace(/^-+|-+$/g, "");
  if (!slug) return privateJson({ error: "Enter a title or reference suitable for a public URL." }, 400);
  try {
    await connectDB();
    await DirectSaleAsset.init();
    const closedAt = input.status === "Closed" || input.status === "Sold" ? new Date() : null;
    const asset = await DirectSaleAsset.create({ ...input, slug, closedAt });
    return privateJson({ asset }, 201);
  } catch (error) {
    return isDuplicateKey(error)
      ? privateJson({ error: "That asset reference or URL already exists." }, 409)
      : privateJson({ error: "Could not save the Direct Sales asset." }, 503);
  }
}
