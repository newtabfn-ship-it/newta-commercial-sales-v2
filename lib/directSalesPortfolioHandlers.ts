import { mongo } from "mongoose";
import { privateJson } from "@/lib/directSalesApi";
import { portfolioInput, clientInput, portfolioStatuses } from "@/lib/directSalesPortfolios";
import { PortfolioApiError, portfolioBody, portfolioId, expectedVersion, listPage } from "@/lib/directSalesPortfolioAdmin";
import { portfolioDatabase, portfolioResponse, clientResponse, requirePortfolioSetup, saveClient } from "@/lib/directSalesPortfolioDb";

const { ObjectId } = mongo;
const portfolioFields = ["title", "slug", "description", "status", "seoTitle", "seoDescription", "sharingImageUrl"] as const;
const editablePortfolioFields = portfolioFields.filter(key => key !== "slug");
const clientFields = ["name", "email", "phone", "internalNotes", "portfolioIds"] as const;
const operation = { maxTimeMS: 5000 };

export async function listPortfolios(request: Request) {
  const page = listPage(request);
  const status = new URL(request.url).searchParams.get("status");
  if (status !== null && !portfolioStatuses.some(value => value === status)) throw new PortfolioApiError(400, "Invalid status.");
  const database = await portfolioDatabase();
  const records = await database.portfolios.find(status ? { status: status as typeof portfolioStatuses[number] } : {}, operation)
    .sort({ createdAt: -1, _id: -1 }).skip((page - 1) * 50).limit(51).toArray();
  return privateJson({ portfolios: records.slice(0, 50).map(portfolioResponse), page, hasMore: records.length > 50 });
}

export async function createPortfolio(request: Request) {
  const body = await portfolioBody(request, portfolioFields);
  const input = portfolioInput({ ...body, status: body.status ?? "Draft" });
  if (!input) throw new PortfolioApiError(400, "Invalid Sales Portfolio.");
  const database = await portfolioDatabase();
  await requirePortfolioSetup(database);
  const now = new Date();
  const record = { ...input, _id: new ObjectId(), __v: 0, createdAt: now, updatedAt: now };
  await database.portfolios.insertOne(record);
  return privateJson({ portfolio: portfolioResponse(record) }, 201);
}

export async function readPortfolio(id: string) {
  const objectId = new ObjectId(portfolioId(id));
  const database = await portfolioDatabase();
  const record = await database.portfolios.findOne({ _id: objectId }, operation);
  if (!record) throw new PortfolioApiError(404, "Sales Portfolio not found.");
  return privateJson({ portfolio: portfolioResponse(record) });
}

export async function updatePortfolio(request: Request, id: string, statusOnly = false) {
  const objectId = new ObjectId(portfolioId(id));
  const body = await portfolioBody(request, statusOnly ? ["status", "version"] : [...editablePortfolioFields, "version"]);
  const version = expectedVersion(body.version);
  if (Object.keys(body).length < 2 || (statusOnly && !portfolioStatuses.some(value => value === body.status))) {
    throw new PortfolioApiError(400, "No valid changes supplied.");
  }
  const database = await portfolioDatabase();
  await requirePortfolioSetup(database);
  const current = await database.portfolios.findOne({ _id: objectId }, operation);
  if (!current) throw new PortfolioApiError(404, "Sales Portfolio not found.");
  if (current.__v !== version) throw new PortfolioApiError(409, "Sales Portfolio changed. Reload before saving.");
  const changes = Object.fromEntries(editablePortfolioFields.filter(key => Object.hasOwn(body, key)).map(key => [key, body[key]]));
  const input = portfolioInput({ ...current, ...changes });
  if (!input) throw new PortfolioApiError(400, "Invalid Sales Portfolio.");
  // Never include slug in an update, even if supplied unchanged by a caller.
  const { slug: permanentSlug, ...fields } = input;
  void permanentSlug;
  const result = await database.portfolios.findOneAndUpdate({ _id: objectId, __v: version },
    { $set: { ...fields, updatedAt: new Date() }, $inc: { __v: 1 } }, { ...operation, returnDocument: "after" });
  if (!result) throw new PortfolioApiError(409, "Sales Portfolio changed. Reload before saving.");
  // Status affects this portfolio only; no asset publication updates.
  return privateJson({ portfolio: portfolioResponse(result) });
}

export async function deletePortfolio(id: string) {
  portfolioId(id);
  // No counts or deletes: existing reference writers are not coordinated yet.
  return privateJson({ error: "Permanent deletion is disabled pending database-backed coordination verification. Archive the Sales Portfolio instead." }, 409);
}

export async function listClients(request: Request) {
  const page = listPage(request);
  const database = await portfolioDatabase();
  const records = await database.clients.find({}, operation).sort({ createdAt: -1, _id: -1 }).skip((page - 1) * 50).limit(51).toArray();
  return privateJson({ clients: records.slice(0, 50).map(clientResponse), page, hasMore: records.length > 50 });
}

export async function createClient(request: Request) {
  const body = await portfolioBody(request, clientFields);
  if (Object.hasOwn(body, "portfolioIds") && !Array.isArray(body.portfolioIds)) throw new PortfolioApiError(400, "Invalid Sales Portfolio assignments.");
  const input = clientInput(body);
  if (!input) throw new PortfolioApiError(400, "Invalid client.");
  return privateJson({ client: await saveClient(await portfolioDatabase(), input) }, 201);
}

export async function readClient(id: string) {
  const objectId = new ObjectId(portfolioId(id));
  const database = await portfolioDatabase();
  const record = await database.clients.findOne({ _id: objectId }, operation);
  if (!record) throw new PortfolioApiError(404, "Client not found.");
  return privateJson({ client: clientResponse(record) });
}

export async function updateClient(request: Request, id: string) {
  const normalizedId = portfolioId(id);
  const body = await portfolioBody(request, [...clientFields, "version"]);
  if (Object.hasOwn(body, "portfolioIds") && !Array.isArray(body.portfolioIds)) throw new PortfolioApiError(400, "Invalid Sales Portfolio assignments.");
  const version = expectedVersion(body.version);
  if (Object.keys(body).length < 2) throw new PortfolioApiError(400, "No changes supplied.");
  const database = await portfolioDatabase();
  const current = await database.clients.findOne({ _id: new ObjectId(normalizedId) }, operation);
  if (!current) throw new PortfolioApiError(404, "Client not found.");
  const changes = Object.fromEntries(clientFields.filter(key => Object.hasOwn(body, key)).map(key => [key, body[key]]));
  const input = clientInput({ ...current, portfolioIds: (current.portfolioIds ?? []).map(String), ...changes });
  if (!input) throw new PortfolioApiError(400, "Invalid client.");
  return privateJson({ client: await saveClient(database, input, normalizedId, version) });
}
