import { Schema, model, models, type Model, type InferSchemaType } from "mongoose";

const schema = new Schema({
  _id: String,
  count: { type: Number, required: true },
  expiresAt: { type: Date, required: true, expires: 0 },
}, { versionKey: false });

type Limit = InferSchemaType<typeof schema>;
const DirectSaleOfferLimit = (models.DirectSaleOfferLimit ?? model("DirectSaleOfferLimit", schema)) as Model<Limit>;
export default DirectSaleOfferLimit;
