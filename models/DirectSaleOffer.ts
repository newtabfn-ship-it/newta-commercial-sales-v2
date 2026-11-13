import { Schema, model, models, type Model, type InferSchemaType } from "mongoose";
import { offerStatuses } from "@/lib/directSales";

const schema = new Schema({
  assetId: { type: Schema.Types.ObjectId, ref: "DirectSaleAsset", required: true },
  assetReference: { type: String, required: true },
  assetTitle: { type: String, required: true },
  askingPriceCents: { type: Number, default: null },
  amountCents: { type: Number, required: true },
  currency: { type: String, enum: ["ZAR"], default: "ZAR" },
  buyerName: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true },
  message: { type: String, default: "" },
  status: { type: String, enum: offerStatuses, default: "New" },
  internalNotes: { type: String, default: "" },
  reviewedBy: { type: Schema.Types.ObjectId, ref: "User" },
}, { timestamps: true });

schema.index({ createdAt: -1, _id: -1 });
schema.index({ status: 1, createdAt: -1, _id: -1 });
schema.index({ assetId: 1, createdAt: -1 });
export type DirectSaleOfferRecord = InferSchemaType<typeof schema>;
const DirectSaleOffer = (models.DirectSaleOffer ?? model("DirectSaleOffer", schema)) as Model<DirectSaleOfferRecord>;
export default DirectSaleOffer;
