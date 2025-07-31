
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import mongoose from "mongoose";
import csv from "csv-parser";
import Product from "./src/models/Products.js";
import dotenv from "dotenv";
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


// MongoDB connection URI
const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.once("open", () => {
  console.log("✅ Connected to MongoDB");
  loadCSVData();
});

function loadCSVData() {
  const results = [];
  fs.createReadStream(path.join(__dirname, "products.csv"))
    .pipe(csv())
    .on("data", (data) => {
      // Parse numeric fields
      const parsed = {
        id: Number(data.id),
        cost: parseFloat(data.cost),
        category: data.category,
        name: data.name,
        brand: data.brand,
        retail_price: parseFloat(data.retail_price),
        department: data.department,
        sku: data.sku,
        distribution_center_id: Number(data.distribution_center_id),
      };
      results.push(parsed);
    })
    .on("end", async () => {
      try {
        await Product.insertMany(results);
        console.log(`✅ Inserted ${results.length} products`);
        mongoose.disconnect();
      } catch (err) {
        console.error("❌ Failed to insert data:", err);
        mongoose.disconnect();
      }
    });
}
