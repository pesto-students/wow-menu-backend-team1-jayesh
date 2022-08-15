import mongoose from "mongoose";
const Schema = mongoose.Schema;

const transactionSchema = new Schema(
  {
    entity: {
      type: Object,
    },
    bill: {
      type: Schema.Types.ObjectId,
      ref: "Bill",
    },
    created_at: {
      type: Date,
      immutable: true,
      default: () => Date.now(),
    },
  },
  {
    timestamps: false,
    versionKey: false,
  },
);

export default mongoose.model("Transaction", transactionSchema);
