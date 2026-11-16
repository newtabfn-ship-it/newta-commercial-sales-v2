import mongoose, { type Connection } from "mongoose";
import DirectSaleAsset, { type DirectSaleAssetRecord } from "@/models/DirectSaleAsset";
import User from "@/models/User";

let pending: Promise<Connection> | undefined;

export async function directSalesSaveModels() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("Direct Sales database is not configured.");

  if (!pending) {
    const connection = mongoose.createConnection(uri, {
      autoCreate: false,
      autoIndex: false,
      bufferCommands: false,
      connectTimeoutMS: 10000,
      serverSelectionTimeoutMS: 10000,
      timeoutMS: 20000,
      maxPoolSize: 5,
    });
    pending = connection.asPromise().catch((error: unknown) => {
      pending = undefined;
      void connection.destroy().catch(() => {});
      throw error;
    });
  }

  const connection = await pending;
  return {
    assets: connection.model<DirectSaleAssetRecord>(
      DirectSaleAsset.modelName, DirectSaleAsset.schema, DirectSaleAsset.collection.name
    ),
    users: connection.model(User.modelName, User.schema, User.collection.name),
  };
}
