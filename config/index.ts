import dotenv from 'dotenv'
dotenv.config()


export const APP_SECRET = process.env.APP_SECRET as string
export const PAYSTACK_SECRET_KEY = process.env.APP_SECRET as string

