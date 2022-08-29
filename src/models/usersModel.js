import mongoose, { Schema } from "mongoose";
import sendMailUtil from "../utils/sendMailUtil";
import { APP_URL } from "../../config";
import hashPassword from "../utils/hashPasswordUtil";
import { Users } from "./index";

const dataSchema = new mongoose.Schema(
  {
    firstname: {
      required: true,
      type: String,
    },
    lastname: {
      required: true,
      type: String,
    },
    password: {
      required: true,
      type: String,
    },
    isAdmin: {
      default: false,
      type: Boolean,
    },
    role: {
      required: true,
      type: String,
      lowercase: true,
    },
    emailId: {
      type: String,
      unique: true,
      trim: true,
      sparse: true,
      index: true,
    },
    username: {
      type: String,
      unique: true,
      trim: true,
      sparse: true,
      index: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    restaurant: {
      type: String,
    },
    createdBy: {
      required: true,
      type: Schema.Types.ObjectId,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

dataSchema.pre("save", async function (next) {
  try {
    if (this.role.trim().toLowerCase() === "owner") {
      this.isAdmin = true;
    }
    if (this.role.trim().toLowerCase() === "owner" && !this.emailId) {
      throw new Error(`Email id is required if your role is ${this.role}`);
    }
    if (
      this.role.trim().toLowerCase() === "owner" &&
      !(await isOwnerUniqueForRestaurant(this.restaurant))
    ) {
      throw new Error(`Multiple owners can't be added for a restaurant`);
    }
    if (this.role.trim().toLowerCase() !== "owner" && !this.username) {
      throw new Error(`Username is required if your role is ${this.role}`);
    }
    this.password = await hashPassword(this.password);
    next();
  } catch (error) {
    throw new Error(error);
  }
});

async function isOwnerUniqueForRestaurant(restaurantId) {
  const data = await Users.find({
    role: "owner",
    restaurant: restaurantId,
  });
  return data.length === 0;
}

dataSchema.post("save", async function (doc) {
  if (doc.emailId) {
    const queryParams = `id=${doc["_id"]}&hashedString=${doc["password"]}`;
    const htmlBody = `<b>Greetings from Wow Menu<b>
                <br> Click on this link to verify your password <br><br>
                <link>${APP_URL}/api/verify/mail?${queryParams}</link>`;
    await sendMailUtil(
      doc.emailId,
      "Wow Menu Verification Mail",
      "Please verify your email id",
      htmlBody,
    );
  }
});

export default mongoose.model("Users", dataSchema, "Users");
