import connectDB from "@/lib/mongodb";
import { requireEnquiryAdmin } from "@/lib/requireEnquiryAdmin";
import { offerStatuses, parseSastClosing } from "@/lib/directSales";
import { isObjectId, privateJson } from "@/lib/directSalesApi";
import DirectSaleOffer from "@/models/DirectSaleOffer";

export async function GET(request: Request) {
  const denied = await requireEnquiryAdmin();
  if (denied) return denied;
  const params = new URL(request.url).searchParams;
  const status = params.get("status");
  const assetId = params.get("assetId");
  const page = Number(params.get("page") ?? "1");
  const from = params.get("from");
  const to = params.get("to");
  const start = from ? parseSastClosing(`${from}T00:00`) : null;
  const end = to ? parseSastClosing(`${to}T00:00`) : null;
  const selectedStatus = offerStatuses.find((value) => value === status);
  if ((status && !selectedStatus) || (assetId && !isObjectId(assetId)) ||
      !Number.isInteger(page) || page < 1 || page > 1000 || (from && !start) ||
      (to && !end) || (start && end && start > end)) {
    return privateJson({ error: "Invalid offer filters." }, 400);
  }
  const filter = {
    ...(selectedStatus ? { status: selectedStatus } : {}),
    ...(assetId ? { assetId } : {}),
    ...(start || end ? { createdAt: {
      ...(start ? { $gte: start } : {}),
      ...(end ? { $lt: new Date(end.getTime() + 86400000) } : {}),
    } } : {}),
  };
  try {
    await connectDB();
    const pageSize = 25;
    const [offers, newCount] = await Promise.all([
      DirectSaleOffer.find(filter)
        .select("assetId assetReference assetTitle amountCents status createdAt")
        .sort({ createdAt: -1, _id: -1 }).skip((page - 1) * pageSize).limit(pageSize + 1).lean(),
      DirectSaleOffer.countDocuments({ status: "New" }),
    ]);
    return privateJson({ offers: offers.slice(0, pageSize), newCount, hasNext: offers.length > pageSize });
  } catch {
    return privateJson({ error: "Could not load Direct Sales offers." }, 503);
  }
}
