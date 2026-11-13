import { requireEnquiryAdmin } from "@/lib/requireEnquiryAdmin";
import OfferInbox from "./OfferInbox";

export const dynamic = "force-dynamic";

export default async function DirectSalesOffersPage() {
  const denied = await requireEnquiryAdmin();
  if (denied) return <p>Active administrator access is required.</p>;
  return <OfferInbox />;
}
