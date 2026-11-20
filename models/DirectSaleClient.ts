import { Schema, model, models, type Model, type InferSchemaType } from "mongoose";
import { portfolioLimits } from "@/lib/directSalesPortfolios";

const schema = new Schema({
  name: { type: String, required: true, trim: true, maxlength: portfolioLimits.clientName },
  email: {
    type: String, trim: true, maxlength: portfolioLimits.email, default: "",
    validate: {
      validator: (value: string) => value === "" || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
      message: "Invalid client email.",
    },
  },
  phone: { type: String, trim: true, maxlength: portfolioLimits.phone, default: "" },
  internalNotes: { type: String, trim: true, maxlength: portfolioLimits.internalNotes, default: "" },
  portfolioIds: {
    type: [{ type: Schema.Types.ObjectId, ref: "DirectSalePortfolio", required: true }],
    default: undefined,
    validate: {
      validator: (ids: unknown[] | null | undefined) => ids === undefined ||
        (Array.isArray(ids) && ids.length <= portfolioLimits.clientPortfolios &&
          ids.every(id => id != null) && new Set(ids.map(String)).size === ids.length),
      message: "Invalid or duplicate client Sales Portfolio assignments.",
    },
  },
}, { timestamps: true, autoCreate: false, autoIndex: false, strict: "throw" });

// Unique multikey index prevents the same portfolio belonging to two clients.
// Exclude missing/empty arrays so clients without assignments remain valid.
schema.index({ portfolioIds: 1 }, {
  unique: true, partialFilterExpression: { "portfolioIds.0": { $exists: true } },
});
export type DirectSaleClientRecord = InferSchemaType<typeof schema>;
const DirectSaleClient = (models.DirectSaleClient ??
  model("DirectSaleClient", schema)) as Model<DirectSaleClientRecord>;
export default DirectSaleClient;
