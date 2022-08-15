import mongoose from "mongoose";
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
    is_admin: {
      default: false,
      type: Boolean,
    },
    role: {
      required: true,
      type: String,
    },
    email_id: {
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
    is_verified: {
      type: Boolean,
      default: false,
    },
    restaurant: {
      type: String,
    },
    created_at: {
      type: Date,
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

dataSchema.pre("save", async function (next) {
  try {
    if (this.role.trim().toLowerCase() === "owner") {
      this.is_admin = true;
    }
    if (this.role.trim().toLowerCase() === "owner" && !this.email_id) {
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
  if (doc.email_id) {
    const queryParams = `id=${doc["_id"]}&hashed_string=${doc["password"]}`;
    const htmlBody = `<b>Greetings from Wow Menu<b>
                <br> Click on this link to verify your password <br><br>
                <link>${APP_URL}/api/verify/mail?${queryParams}</link>`;
    await sendMailUtil(
      doc.email_id,
      "Wow Menu Verification Mail",
      "Please verify your email id",
      htmlBody,
    );
  }
});

export default mongoose.model("Users", dataSchema, "Users");
