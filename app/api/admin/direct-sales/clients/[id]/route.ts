import { portfolioAdminRequest } from "@/lib/directSalesPortfolioAdmin";
import { readClient, updateClient } from "@/lib/directSalesPortfolioHandlers";

type Context = { params: Promise<{ id: string }> };
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export async function GET(request: Request, context: Context) {
  return portfolioAdminRequest(request, async () => readClient((await context.params).id));
}
export async function PATCH(request: Request, context: Context) {
  return portfolioAdminRequest(request, async () => updateClient(request, (await context.params).id));
}
