import { requireEnquiryAdmin } from "@/lib/requireEnquiryAdmin";
import AssetManager from "./AssetManager";

export const dynamic = "force-dynamic";

export default async function DirectSalesAdminPage() {
  const denied = await requireEnquiryAdmin();
  if (denied) return <p>Active administrator access is required.</p>;
  return <AssetManager />;
}
