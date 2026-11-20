import { portfolioAdminRequest } from "@/lib/directSalesPortfolioAdmin";
import { readPortfolio, updatePortfolio, deletePortfolio } from "@/lib/directSalesPortfolioHandlers";

type Context = { params: Promise<{ id: string }> };
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export async function GET(request: Request, context: Context) {
  return portfolioAdminRequest(request, async () => readPortfolio((await context.params).id));
}
export async function PATCH(request: Request, context: Context) {
  return portfolioAdminRequest(request, async () => updatePortfolio(request, (await context.params).id));
}
export async function DELETE(request: Request, context: Context) {
  return portfolioAdminRequest(request, async () => deletePortfolio((await context.params).id));
}
