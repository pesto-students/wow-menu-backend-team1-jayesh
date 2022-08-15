import dotenv from "dotenv";
dotenv.config();

export const {
  APP_PORT,
  DATABASE_URL,
  APP_URL,
  EMAIL_ID,
  PASSWORD,
  APP_ENV,
  SECRET_KEY,
  RAZORPAY_KEY_DEV,
  RAZORPAY_SECRET_DEV,
  RAZORPAY_WEBHOOK_SECRET,
} = process.env;
