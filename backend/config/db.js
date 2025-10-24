import mongoose from "mongoose";
import colors from "colors"

const connectDB = async () => {
   try{
      const conn = await mongoose.connect(process.env.MONGO_URI);
      console.log('MongoDB Connected successfully!'.bgMagenta.white);
   } catch (error){
      // Generic message for production, detailed only in dev
      if (process.env.NODE_ENV === "development") {
         console.log(error.bgRed.white); // full error in development
      } else {
         console.log("MongoDB connection failed!".bgRed.white);
      }
      process.exit(1); // Stop the app
   }
}

export default connectDB;