export const portfolioStatuses = ["Draft", "Published", "Archived"] as const;
export type PortfolioStatus = (typeof portfolioStatuses)[number];

export const portfolioLimits = {
  title: 150, description: 6000, slug: 100,
  seoTitle: 160, seoDescription: 320, sharingImageUrl: 1000,
  clientName: 150, email: 254, phone: 40, internalNotes: 4000, clientPortfolios: 500,
} as const;

export const portfolioSlugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
export const portfolioIdPattern = /^[a-f0-9]{24}$/i;

function boundedText(value: unknown, limit: number): string | null {
  return typeof value === "string" && value.length <= limit ? value.trim() : null;
}

export function isPortfolioSlug(value: unknown): value is string {
  return typeof value === "string" && value.length <= portfolioLimits.slug &&
    portfolioSlugPattern.test(value);
}

export function isSharingImageUrl(value: string): boolean {
  if (value === "") return true;
  if (value.length > portfolioLimits.sharingImageUrl) return false;
  try {
    const url = new URL(value);
    return url.protocol === "https:" && !url.username && !url.password && !url.hash && !url.search && !url.port &&
 ((url.hostname === "res.cloudinary.com" && /^\/[a-zA-Z0-9_-]+\/image\/upload\/.+\.(?:png|jpe?g|webp)$/i.test(url.pathname)));
  } catch {
    return false;
  }
}

// undefined means legacy/unknown, null means explicitly unassigned.
export function parsePortfolioId(value: unknown): string | null | undefined {
  if (value === undefined || value === null) return value;
  if (typeof value !== "string" || !portfolioIdPattern.test(value)) {
    throw new Error("Invalid Sales Portfolio identifier.");
  }
  return value.toLowerCase();
}

export function portfolioMembership(value: unknown): "Unknown" | "Unassigned" | "Assigned" {
  const id = parsePortfolioId(value);
  return id === undefined ? "Unknown" : id === null ? "Unassigned" : "Assigned";
}

export function portfolioInput(body: Record<string, unknown> | null) {
  if (!body) return null;
  const title = boundedText(body.title, portfolioLimits.title);
  const slug = boundedText(body.slug, portfolioLimits.slug);
  const status = portfolioStatuses.find(value => value === body.status);
  const description = boundedText(body.description ?? "", portfolioLimits.description);
  const seoTitle = boundedText(body.seoTitle ?? "", portfolioLimits.seoTitle);
  const seoDescription = boundedText(body.seoDescription ?? "", portfolioLimits.seoDescription);
  const sharingImageUrl = boundedText(body.sharingImageUrl ?? "", portfolioLimits.sharingImageUrl);
  if (!title || !slug || !isPortfolioSlug(slug) || !status || description === null ||
      seoTitle === null || seoDescription === null || sharingImageUrl === null ||
      !isSharingImageUrl(sharingImageUrl)) return null;
  return { title, slug, status, description, seoTitle, seoDescription, sharingImageUrl };
}

export function clientInput(body: Record<string, unknown> | null) {
  if (!body) return null;
  const name = boundedText(body.name, portfolioLimits.clientName);
  const email = boundedText(body.email ?? "", portfolioLimits.email);
  const phone = boundedText(body.phone ?? "", portfolioLimits.phone);
  const internalNotes = boundedText(body.internalNotes ?? "", portfolioLimits.internalNotes);
  const ids = body.portfolioIds ?? [];
  if (!name || email === null || phone === null || internalNotes === null ||
      (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) ||
      !Array.isArray(ids) || ids.length > portfolioLimits.clientPortfolios) return null;
  const portfolioIds: string[] = [];
  for (const value of ids) {
    if (typeof value !== "string" || !portfolioIdPattern.test(value)) return null;
    const id = value.toLowerCase();
    if (portfolioIds.includes(id)) return null;
    portfolioIds.push(id);
  }
  return { name, email, phone, internalNotes, portfolioIds };
}

export const publicPortfolioProjection = Object.freeze({
  _id: 0, title: 1, slug: 1, status: 1, description: 1,
  seoTitle: 1, seoDescription: 1, sharingImageUrl: 1,
} as const);

// Never spread a database document into public props, even after a projection.
export function publicPortfolio(source: Record<string, unknown>) {
  return portfolioInput({
    title: source.title, slug: source.slug, status: source.status,
    description: source.description, seoTitle: source.seoTitle,
    seoDescription: source.seoDescription, sharingImageUrl: source.sharingImageUrl,
  });
}

export function portfolioLifecycle(status: PortfolioStatus) {
  return {
    publicPage: status === "Published" || status === "Archived",
    archiveNotice: status === "Archived",
    showEligibleAssets: status === "Published",
    indexable: status === "Published",
  };
}

/**
 * A local eligibility check, not permission to delete from the database.
 * Later handlers must serialize assignment, offer snapshots and deletion against
 * the same portfolio document using one session/connection and a coordinated
 * write in a transaction (or a verified equivalent). Count-then-delete alone
 * races with new references. Snapshot membership must come from the asset, and
 * retries must preserve the first offer's snapshot. Reassignment must coordinate
 * with snapshot capture. Database-backed concurrency tests are still required.
 */
export function canDeletePortfolio(state: {
  status: unknown; assetReferences: number; historicalOfferReferences: number;
}): boolean {
  return state.status === "Draft" &&
    Number.isSafeInteger(state.assetReferences) && state.assetReferences === 0 &&
    Number.isSafeInteger(state.historicalOfferReferences) && state.historicalOfferReferences === 0;
}

// Proposed only: do not register this on the existing auto-indexed Offer schema.
// A separately approved index setup must provision it before portfolio filters.
export const proposedOfferPortfolioIndex = {
  key: { portfolioIdAtSubmission: 1, createdAt: -1, _id: -1 },
  options: { name: "portfolioIdAtSubmission_1_createdAt_-1__id_-1" },
} as const;
