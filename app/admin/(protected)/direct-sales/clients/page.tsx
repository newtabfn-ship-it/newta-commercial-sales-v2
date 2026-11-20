import { requireEnquiryAdmin } from "@/lib/requireEnquiryAdmin";
import ClientManager from "./ClientManager";

export const dynamic = "force-dynamic";

export default async function DirectSalesClientsPage() {
  const denied = await requireEnquiryAdmin();
  if (denied) return <p>Active administrator access is required.</p>;
  return <ClientManager />;
}
