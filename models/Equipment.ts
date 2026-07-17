import mongoose, { Schema, models, model } from "mongoose";

const EquipmentSchema = new Schema(
  {
    referenceNumber: {
      type: String,
      required: true,
      unique: true,
    },

    category: {
      type: String,
      required: true,
    },

    title: {
      type: String,
      required: true,
    },

    manufacturer: String,

    model: String,

    year: String,

    serialNumber: String,

    kmHours: String,

    tyresTracks: String,

    province: String,

    price: String,

currency: {
  type: String,
  default: "ZAR",
},

vatIncluded: {
  type: Boolean,
  default: false,
},

views: {
  type: Number,
  default: 0,
},

status: {
  type: String,
  enum: ["Available", "Sold"],
  default: "Available",
},
    condition: {
      type: String,
      enum: [
        "Excellent",
        "Good",
        "Fair",
        "Needs Attention",
      ],
      default: "Good",
    },

    description: String,

    specifications: {
      engine: String,
      capacityBucket: String,
      fuelType: String,
      transmission: String,
    },

    images: [
      {
        url: String,
        cover: {
          type: Boolean,
          default: false,
        },
      },
    ],

    featured: {
      type: Boolean,
      default: false,
    },

    showOnHomePage: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export default models.Equipment ||
  model("Equipment", EquipmentSchema);