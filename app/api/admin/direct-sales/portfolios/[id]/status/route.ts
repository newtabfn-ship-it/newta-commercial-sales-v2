import { portfolioAdminRequest } from "@/lib/directSalesPortfolioAdmin";
import { updatePortfolio } from "@/lib/directSalesPortfolioHandlers";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  return portfolioAdminRequest(request, async () => updatePortfolio(request, (await context.params).id, true));
}
