import mongoose from "mongoose";
import dotenv from 'dotenv'

dotenv.config();

const connectDB = async ()=>{
    try {
        await mongoose.connect(process.env.MONGO_DB_URL);
        console.log("✅ MongoDB connected Successfully");
    } catch (error) {
        console.log("MONGO NOT CONNECTED X",error)
    }
}

export default connectDB;