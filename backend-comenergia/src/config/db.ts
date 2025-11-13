import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) throw new Error("Falta MONGO_URI en .env");
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Conectado a MongoDB");
  } catch (error) {
    console.error("No fue posible conectar a MongoDB:", error);
    process.exit(1);
  }
};
export default connectDB;