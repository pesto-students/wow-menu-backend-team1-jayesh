import mongoose from "mongoose";
const Schema = mongoose.Schema;

const orderSchema = new Schema(
  {
    iterations: [
      {
        items: [Object],
        instruction: {
          type: String,
        },
        status: {
          type: String,
          default: "Pending",
        },
        createdAt: {
          type: Date,
          immutable: true,
          default: () => Date.now(),
        },
        acceptedBy: {
          type: String,
          default: "",
        }, // TODO:to be changed to id of user and need to check if Id is present in User.
      },
    ],
    tableNo: {
      type: Number,
      required: true,
    },
    orderNo: String, // TODO:to be auto generated
    restaurant: String, // TODO:to be changed to id of restaurant and need to check if Id is present in Restaurant.
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export default mongoose.model("Order", orderSchema);
