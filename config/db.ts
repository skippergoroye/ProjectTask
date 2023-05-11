import mongoose from 'mongoose'
import dotenv from 'dotenv'
dotenv.config();


export default async () => {
    try {
        mongoose.set('strictQuery', true)
        const conn = mongoose.connect(process.env.MONGO_URI!)
        console.log('MongoDB Connected')
    } catch (error) {
        console.log(error)
        process.exit(1)
    }
}