import { mongo } from "mongoose";
import { directSalesSaveModels } from "@/lib/directSalesSaveDb";
import DirectSalePortfolio from "@/models/DirectSalePortfolio";
import DirectSaleClient from "@/models/DirectSaleClient";
import { PortfolioApiError } from "@/lib/directSalesPortfolioAdmin";
import { portfolioInput, clientInput, publicPortfolio } from "@/lib/directSalesPortfolios";

const { ObjectId } = mongo;
type ObjectId = mongo.ObjectId;
type ClientSession = mongo.ClientSession;
type PortfolioFields = NonNullable<ReturnType<typeof portfolioInput>>;
type ClientFields = Omit<NonNullable<ReturnType<typeof clientInput>>, "portfolioIds"> & { portfolioIds: ObjectId[] };
type Revision = { _id: ObjectId; __v: number; createdAt: Date; updatedAt: Date };
export type PortfolioRecord = PortfolioFields & Revision;
type ClientRecord = ClientFields & Revision;
const operation = { maxTimeMS: 5000 };

// Reuse the bounded connection's client. Do not change the shared connector, or
// register the existing Offer model here (which could trigger automatic indexes).
export async function portfolioDatabase() {
  const { assets } = await directSalesSaveModels();
  const connection = assets.db;
  const db = connection.db;
  if (!db) throw new PortfolioApiError(503, "Sales Portfolio database unavailable.");
  return {
    connection,
    assets,
    portfolios: db.collection<PortfolioRecord>(DirectSalePortfolio.collection.name),
    clients: db.collection<ClientRecord>(DirectSaleClient.collection.name),
  };
}
type Database = Awaited<ReturnType<typeof portfolioDatabase>>;

// Read-only setup gate, never init(), createCollection(), or createIndexes().
// A separately approved setup must provision both MongoDB namespaces and these indexes.
export async function requirePortfolioSetup(database: Database) {
  const db = database.connection.db!;
  for (const [name, field] of [[database.portfolios.collectionName, "slug"], [database.clients.collectionName, "portfolioIds"]] as const) {
    const info = await db.listCollections({ name }, { ...operation, nameOnly: false }).next();
    if (!info) throw new PortfolioApiError(503, "Sales Portfolio database setup is required.");
    const indexes = await db.collection(name).listIndexes(operation).toArray();
    const valid = indexes.some(index => {
      if (Object.keys(index.key).length !== 1 || index.key[field] !== 1 || index.unique !== true || index.sparse === true) return false;
      const collation = index.collation ?? info.options?.collation;
      if (collation && collation.locale !== "simple") return false;
      const partial = index.partialFilterExpression;
      return field === "slug" ? partial === undefined :
        JSON.stringify(partial) === JSON.stringify({ "portfolioIds.0": { $exists: true } });
    });
    if (!valid) throw new PortfolioApiError(503, "Required Sales Portfolio indexes are not verified.");
  }
}

export async function withPortfolioTransaction<T>(database: Database, run: (session: ClientSession) => Promise<T>): Promise<T> {
  await requirePortfolioSetup(database);
  const session = database.connection.getClient().startSession();
  try {
    return await session.withTransaction(() => run(session), {
      readConcern: { level: "snapshot" }, writeConcern: { w: "majority" },
      readPreference: "primary", maxCommitTimeMS: 5000, timeoutMS: 15000,
    });
  } finally { await session.endSession(); }
}

// Every future reference writer must use this lock in the SAME transaction.
// Sorted locks serialize competing ownership edits; no process-local mutex.
export async function lockPortfolios(database: Database, ids: string[], session: ClientSession) {
  for (const id of [...new Set(ids)].sort()) {
    const result = await database.portfolios.updateOne({ _id: new ObjectId(id) }, { $inc: { __v: 1 } }, { session, ...operation });
    if (result.matchedCount !== 1) throw new PortfolioApiError(409, "An assigned Sales Portfolio no longer exists.");
  }
}

export function portfolioResponse(doc: PortfolioRecord) {
  return { ...publicPortfolio(doc), id: String(doc._id), version: doc.__v, createdAt: doc.createdAt, updatedAt: doc.updatedAt };
}
export function clientResponse(doc: ClientRecord) {
  // Only called by authenticated PRIVATE client routes; never a public DTO.
  return { id: String(doc._id), name: doc.name, email: doc.email, phone: doc.phone,
    internalNotes: doc.internalNotes, portfolioIds: (doc.portfolioIds ?? []).map(String),
    version: doc.__v, createdAt: doc.createdAt, updatedAt: doc.updatedAt };
}

export async function saveClient(database: Database, input: NonNullable<ReturnType<typeof clientInput>>, id?: string, version?: number) {
  // Generated outside the retryable callback: transaction retries keep identity.
  const objectId = id ? new ObjectId(id) : new ObjectId();
  return withPortfolioTransaction(database, async session => {
    const current = id ? await database.clients.findOne({ _id: objectId }, { session, ...operation }) : null;
    if (id && !current) throw new PortfolioApiError(404, "Client not found.");
    if (current && current.__v !== version) throw new PortfolioApiError(409, "Client changed. Reload before saving.");
    const ids = input.portfolioIds;
    await lockPortfolios(database, [...ids, ...(current?.portfolioIds ?? []).map(String)], session);
    if (ids.length && await database.clients.findOne({ _id: { $ne: objectId }, portfolioIds: { $in: ids.map(value => new ObjectId(value)) } }, { session, ...operation })) {
      throw new PortfolioApiError(409, "A Sales Portfolio already belongs to another client.");
    }
    const now = new Date();
    const fields = { ...input, portfolioIds: ids.map(value => new ObjectId(value)), updatedAt: now };
    if (current) {
      const result = await database.clients.findOneAndUpdate({ _id: objectId, __v: version }, { $set: fields, $inc: { __v: 1 } }, { session, ...operation, returnDocument: "after" });
      if (!result) throw new PortfolioApiError(409, "Client changed. Reload before saving.");
      return clientResponse(result);
    }
    const record: ClientRecord = { ...fields, _id: objectId, __v: 0, createdAt: now };
    await database.clients.insertOne(record, { session });
    return clientResponse(record);
  });
}

/**
 * Asset create/edit and new offer snapshots join this protocol: lock the asset
 * document (including Unassigned assets), then affected portfolios in sorted
 * order in the same client/session. Replays return the original stored snapshot;
 * missing legacy values stay missing. Permanent deletion remains DISABLED.
 * Enable only after a separately reviewed lifecycle policy and replica-set races,
 * rollback, timeout and index enforcement tests. No transaction guarantee is
 * claimed from mocks, and no cross-connection session may be used.
 */
