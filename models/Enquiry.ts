import mongoose, { Schema, model, models } from "mongoose";

const EnquirySchema = new Schema(
  {
    equipmentId: {
      type: Schema.Types.ObjectId,
      ref: "Equipment",
    },

    equipmentTitle: {
      type: String,
      default: "",
    },

    referenceNumber: {
  type: String,
  default: "",
},

    name: {
      type: String,
      required: true,
    },

    company: {
      type: String,
      default: "",
    },

    phone: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
    },

    province: {
      type: String,
      default: "",
    },

    message: {
      type: String,
      default: "",
    },

    status: {
      type: String,
      enum: ["New", "Read"],
      default: "New",
    },
  },
  {
    timestamps: true,
  }
);

export default models.Enquiry ||
  model("Enquiry", EnquirySchema);