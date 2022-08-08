import dotenv from 'dotenv'
dotenv.config()

export const { APP_PORT, DATABASE_URL, APP_URL, EMAIL_ID, PASSWORD } =
    process.env
