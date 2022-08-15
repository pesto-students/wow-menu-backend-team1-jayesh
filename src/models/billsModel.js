import mongoose from "mongoose";
const Schema = mongoose.Schema;

const billSchema = new Schema(
  {
    items: [
      {
        _id: false,
        item_id: {
          type: Schema.Types.ObjectId,
          ref: "MenuItem",
        },
        name: String,
        price: Number,
        quantity: Number,
      },
    ],
    total_quantity: {
      type: Number,
    },
    subtotal: {
      type: Number,
    },
    cgst: {
      type: Number,
      default: 0,
    },
    sgst: {
      type: Number,
      default: 0,
    },
    total: {
      type: Number,
    },
    discount_percentage: {
      type: Number,
      default: 0,
    },
    payment_mode: {
      type: String,
    },
    razorpay: {
      type: Schema.Types.ObjectId,
      ref: "Transaction",
    },
    order_id: {
      type: Schema.Types.ObjectId,
      ref: "Order",
    },
    table_no: {
      type: Number,
      required: true,
    },
    bill_no: String, // TODO:to be auto generated
    restaurant_id: String, // TODO:to be changed to id of restaurant and need to check if Id is present in Restaurant.
    created_by: {
      type: String,
      default: "",
    }, // TODO:to be changed to id of user and need to check if Id is present in User.
    created_at: {
      type: Date,
      immutable: true,
      default: () => Date.now(),
    },
    updated_at: {
      type: Date,
      default: () => Date.now(),
    },
  },
  {
    timestamps: false,
    versionKey: false,
  },
);

billSchema.pre("save", async function (next) {
  try {
    this.updated_at = new Date();
    next();
  } catch (error) {
    next(error);
  }
});
export default mongoose.model("Bill", billSchema);
