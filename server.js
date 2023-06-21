import express from "express";
import morgan from "morgan";
import colors from "colors";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./configs/database.js";
const app = express();
import userRoutes from "./routes/userRoutes.js";
import blogRoutes from "./routes/blogRoutes.js";

dotenv.config();
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

connectDB();

// routes integration
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/blog", blogRoutes);
//PORT
const port = process.env.PORT || 8080;
//REST API
app.get("/", (req, res) => {
  res.send("this is working");
});

app.listen(port, () => {
  console.log(`The App is running on the ${port}`.bgGreen);
});
