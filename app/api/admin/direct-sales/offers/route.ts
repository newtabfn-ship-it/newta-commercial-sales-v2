import { privateJson } from "@/lib/directSalesApi";
import { portfolioAdminRequest } from "@/lib/directSalesPortfolioAdmin";
import { adminOfferList, offerListInput } from "@/lib/directSalesOfferAdmin";

export async function GET(request: Request) {
  return portfolioAdminRequest(request, async () => {
    const result = await adminOfferList(offerListInput(request));
    return privateJson(result);
  });
}
