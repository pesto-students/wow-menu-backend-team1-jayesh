import mongoose from "mongoose";

const dataSchema = new mongoose.Schema(
  {
    name: {
      required: true,
      type: String,
      unique: true,
      trim: true,
    },
    phoneNumber: {
      required: true,
      type: String,
    },
    address: {
      required: false,
      type: String,
      trim: false,
    },
    gstNumber: {
      required: true,
      type: String,
    },
    gstPercentage: {
      required: true,
      type: Number,
    },
    totalTables: {
      required: true,
      type: Number,
    },
    createdBy: {
      required: true,
      type: String,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export default mongoose.model("Restaurant", dataSchema, "Restaurants");
