import mongoose from "mongoose";
import 'dotenv/config'

const connectDB = async()=>{
    try{
        const connectionInstance = await mongoose.connect(process.env.MONGODB_URL);
        console.log("Connected Successfully to MonogDB Atlas ! Host: "+connectionInstance.connection.host);
    }catch(error){
        console.log("MongoDB connection error:",error);
        process.exit(1)
    }
}


export default connectDB;