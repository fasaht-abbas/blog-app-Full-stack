import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URL);
    console.log(`Database connected with ${conn.connection.host}`.bgYellow);
  } catch (error) {
    console.log("ERROR IN CONNECTION WITH DATABASE".bgRed);
  }
};

export default connectDB;
