import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { mongo } from "mongoose";
import { portfolioAdminRequest } from "@/lib/directSalesPortfolioAdmin";
import { adminOfferDetail } from "@/lib/directSalesOfferAdmin";
import { offerStore } from "@/lib/directSalesOfferStore";
import { offerStatuses } from "@/lib/directSales";
import { boundedText, isObjectId, privateJson, readJson } from "@/lib/directSalesApi";

type Context = { params: Promise<{ id: string }> };

export async function GET(request: Request, { params }: Context) {
  return portfolioAdminRequest(request, async () => {
    const { id } = await params;
    if (!isObjectId(id)) return privateJson({ error: "Offer not found." }, 404);
    try {
      const offer = await adminOfferDetail(id);
      return offer ? privateJson({ offer }) : privateJson({ error: "Offer not found." }, 404);
    } catch {
      return privateJson({ error: "Could not load the offer." }, 503);
    }
  });
}

export async function PATCH(request: Request, { params }: Context) {
  return portfolioAdminRequest(request, async () => {
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
      const store = await offerStore();
      const changed = await store.offers.findOneAndUpdate(
        { _id: new mongo.ObjectId(id), updatedAt: new Date(version) },
        { $set: { status, internalNotes, reviewedBy: new mongo.ObjectId(reviewer), updatedAt: new Date(Math.max(Date.now(), Date.parse(version) + 1)) } },
        { returnDocument: "after", maxTimeMS: 5000 }
      );
      if (!changed) return privateJson({ error: "The offer changed or no longer exists. Reload before editing." }, 409);
      const offer = await adminOfferDetail(id);
      return offer ? privateJson({ offer }) : privateJson({ error: "Review save could not be confirmed. Reload the offer." }, 503);
    } catch {
      return privateJson({ error: "Could not update the offer." }, 503);
    }
  });
}
