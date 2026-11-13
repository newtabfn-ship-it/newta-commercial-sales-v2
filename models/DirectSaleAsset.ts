import { Schema, model, models, type Model, type InferSchemaType } from "mongoose";
import { assetStatuses } from "@/lib/directSales";

const schema = new Schema({
  referenceNumber: { type: String, required: true, unique: true },
  slug: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  category: { type: String, required: true },
  description: { type: String, default: "" },
  specifications: { type: String, default: "" },
  location: { type: String, default: "" },
  askingPriceCents: { type: Number, default: null },
  closesAt: { type: Date, default: null },
  status: { type: String, enum: assetStatuses, default: "Draft" },
  closedAt: { type: Date, default: null },
  images: [{
    _id: false,
    url: { type: String, required: true },
    publicId: { type: String, required: true },
    cover: { type: Boolean, default: false },
  }],
}, { timestamps: true });

schema.index({ status: 1, category: 1, createdAt: -1 });
export type DirectSaleAssetRecord = InferSchemaType<typeof schema>;
const DirectSaleAsset = (models.DirectSaleAsset ?? model("DirectSaleAsset", schema)) as Model<DirectSaleAssetRecord>;
export default DirectSaleAsset;
