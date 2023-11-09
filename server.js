import express from "express";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import path from "path";
import colors from "colors";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./configs/database.js";
const app = express();
import userRoutes from "./routes/userRoutes.js";
import blogRoutes from "./routes/blogRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import commentRoutes from "./routes/commentRoutes.js";
dotenv.config();
app.use(express.json());
app.use(cookieParser());
app.use(
  "*",
  cors({
    origin: true,
    credentials: true,
  })
);
app.use(morgan("dev"));

connectDB();

// routes integration
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/blog", blogRoutes);
app.use("/api/v1/cat", categoryRoutes);
app.use("/api/v1/comment", commentRoutes);
app.use(express.static(path.join(__dirname, "./client/build")));
//PORT
const port = process.env.PORT || 8080;
//REST API
app.get("/", (req, res) => {
  res.send("this is working");
});

//responsing the wildCard "*" with the html file this is used because it is a single page application
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "./client/build/index.html"));
});

app.listen(port, () => {
  console.log(`The App is running on the ${port}`.bgGreen);
});
