import { requireEnquiryAdmin } from "@/lib/requireEnquiryAdmin";
import PortfolioManager from "./PortfolioManager";

export const dynamic = "force-dynamic";

export default async function DirectSalesPortfoliosPage() {
  const denied = await requireEnquiryAdmin();
  if (denied) return <p>Active administrator access is required.</p>;
  return <PortfolioManager />;
}
