import mongoose, { Schema } from "mongoose";

const dataSchema = new mongoose.Schema(
  {
    name: {
      required: true,
      type: String,
      unique: true,
      trim: true,
    },
    description: {
      required: false,
      type: String,
      trim: true,
    },
    price: {
      required: true,
      type: Number,
    },
    discountedPrice: {
      required: false,
      type: Number,
    },
    category: {
      required: true,
      type: Schema.Types.ObjectId,
      ref: "Categories",
    },
    isActive: {
      required: false,
      type: Boolean,
      default: true,
    },
    isAvailable: {
      required: false,
      type: Boolean,
      default: true,
    },
    isVeg: {
      required: true,
      type: Boolean,
    },
    spicy: {
      required: false,
      type: String,
      lowercase: true,
      trim: true,
    },
    imageUrl: {
      required: false,
      type: String,
    },
    modelUrl: {
      required: false,
      type: String,
    },
    preparationTime: {
      required: false,
      type: Number,
    },
    createdBy: {
      required: true,
      type: String,
    },
    restaurant: {
      required: true,
      type: String,
    },
    createdAt: {
      type: Date,
      default: () => Date.now(),
    },
    updatedAt: {
      type: Date,
      default: () => Date.now(),
    },
  },
  {
    timestamps: false,
    versionKey: false,
  },
);

export default mongoose.model("MenuItem", dataSchema, "MenuItems");
