import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import { requireEnquiryAdmin } from "@/lib/requireEnquiryAdmin";
import { offerStatuses } from "@/lib/directSales";
import { boundedText, isObjectId, privateJson, readJson } from "@/lib/directSalesApi";
import DirectSaleOffer from "@/models/DirectSaleOffer";

type Context = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Context) {
  const denied = await requireEnquiryAdmin();
  if (denied) return denied;
  const { id } = await params;
  if (!isObjectId(id)) return privateJson({ error: "Offer not found." }, 404);
  try {
    await connectDB();
    const offer = await DirectSaleOffer.findById(id).lean();
    return offer ? privateJson({ offer }) : privateJson({ error: "Offer not found." }, 404);
  } catch {
    return privateJson({ error: "Could not load the offer." }, 503);
  }
}

export async function PATCH(request: Request, { params }: Context) {
  const denied = await requireEnquiryAdmin();
  if (denied) return denied;
  const { id } = await params;
  if (!isObjectId(id)) return privateJson({ error: "Offer not found." }, 404);
  const body = await readJson(request, 24000);
  const status = offerStatuses.find((value) => value === body?.status);
  const internalNotes = boundedText(body?.internalNotes, 4000);
  const version = boundedText(body?.updatedAt, 40);
  if (!status || internalNotes === null || !version || !Number.isFinite(Date.parse(version))) {
    return privateJson({ error: "Enter a valid status and notes." }, 400);
  }
  try {
    const session = await getServerSession(authOptions);
    const reviewer = (session?.user as { id?: unknown } | undefined)?.id;
    if (!isObjectId(reviewer)) return privateJson({ error: "Sign in again before saving." }, 401);
    await connectDB();
    const offer = await DirectSaleOffer.findOneAndUpdate(
      { _id: id, updatedAt: new Date(version) },
      { $set: { status, internalNotes, reviewedBy: reviewer } },
      { new: true, runValidators: true }
    ).lean();
    return offer ? privateJson({ offer }) : privateJson({ error: "The offer changed or no longer exists. Reload before editing." }, 409);
  } catch {
    return privateJson({ error: "Could not update the offer." }, 503);
  }
}
