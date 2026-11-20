import { portfolioAdminRequest } from "@/lib/directSalesPortfolioAdmin";
import { listPortfolios, createPortfolio } from "@/lib/directSalesPortfolioHandlers";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export async function GET(request: Request) {
  return portfolioAdminRequest(request, () => listPortfolios(request));
}
export async function POST(request: Request) {
  return portfolioAdminRequest(request, () => createPortfolio(request));
}
