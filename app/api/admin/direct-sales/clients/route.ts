import { portfolioAdminRequest } from "@/lib/directSalesPortfolioAdmin";
import { listClients, createClient } from "@/lib/directSalesPortfolioHandlers";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export async function GET(request: Request) {
  return portfolioAdminRequest(request, () => listClients(request));
}
export async function POST(request: Request) {
  return portfolioAdminRequest(request, () => createClient(request));
}
