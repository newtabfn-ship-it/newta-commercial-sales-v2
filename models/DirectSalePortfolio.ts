import { Schema, model, models, type Model, type InferSchemaType } from "mongoose";
import {
  portfolioLimits, portfolioStatuses, isPortfolioSlug, isSharingImageUrl,
} from "@/lib/directSalesPortfolios";

const schema = new Schema({
  title: { type: String, required: true, trim: true, maxlength: portfolioLimits.title },
  slug: {
    type: String, required: true, immutable: true, maxlength: portfolioLimits.slug,
    validate: { validator: isPortfolioSlug, message: "Invalid Sales Portfolio slug." },
  },
  description: { type: String, trim: true, maxlength: portfolioLimits.description, default: "" },
  status: { type: String, enum: portfolioStatuses, default: "Draft", required: true },
  seoTitle: { type: String, trim: true, maxlength: portfolioLimits.seoTitle, default: "" },
  seoDescription: { type: String, trim: true, maxlength: portfolioLimits.seoDescription, default: "" },
  sharingImageUrl: {
    type: String, maxlength: portfolioLimits.sharingImageUrl, default: "",
    validate: { validator: isSharingImageUrl, message: "Invalid sharing image URL." },
  },
}, { timestamps: true, autoCreate: false, autoIndex: false, strict: "throw" });

schema.index({ slug: 1 }, { unique: true, collation: { locale: "simple" } });
schema.index({ status: 1, createdAt: -1, _id: -1 });
export type DirectSalePortfolioRecord = InferSchemaType<typeof schema>;
const DirectSalePortfolio = (models.DirectSalePortfolio ??
  model("DirectSalePortfolio", schema)) as Model<DirectSalePortfolioRecord>;
export default DirectSalePortfolio;
