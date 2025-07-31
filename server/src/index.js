import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import morgan from "morgan";
import productRoutes from "./routes/productRoutes.js";
import departmentRoutes from "./routes/departmentRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

//database connection
mongoose.connect(process.env.MONGO_URI);
mongoose.connection.on("connected", () => {
  console.log("Connected to MongoDB");
});
mongoose.connection.on("error", (err) => {
  console.error("Error connecting to MongoDB:", err);
});

app.use("/api/products", productRoutes)
app.use("/api/departments", departmentRoutes)

//server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
