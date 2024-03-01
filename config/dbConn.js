import mongoose from "mongoose";
import { config } from "dotenv";

config();

const mongoURI = process.env.MONGO_URI;

export const connectDB = async () => {
  try {
    const con = await mongoose.connect(mongoURI);
    console.log(`Database connected to ${con.connection.host}`);
  } catch (error) {
    console.log(error);
  }
};
