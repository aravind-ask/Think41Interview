import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import mongoose from "mongoose";
import csv from "csv-parser";
import Product from "./src/models/Products.js";
import Department from "./src/models/Departments.js";
import dotenv from "dotenv";
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// MongoDB connection URI
const MONGO_URI = process.env.MONGO_URI;

async function connectToMongo() {
  await mongoose.connect(MONGO_URI);
  console.log("✅ MongoDB connected");
}

async function loadCSVData() {
  const departmentMap = new Map(); // Map to hold department name → ObjectId
  const products = [];

  const filePath = path.join(__dirname, "products.csv");
  const rawData = [];

  // Step 1: Read all CSV rows
  await new Promise((resolve, reject) => {
    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (row) => rawData.push(row))
      .on("end", resolve)
      .on("error", reject);
  });

  console.log(`📦 Read ${rawData.length} records from CSV`);

  // Step 2: Cleanup old collections (optional for testing)
  await Product.deleteMany({});
  await Department.deleteMany({});

  // Step 3: Create Departments
  const departmentNames = [...new Set(rawData.map((r) => r.department))];
  for (const name of departmentNames) {
    const dept = await Department.create({ name });
    departmentMap.set(name, dept._id);
  }

  // Step 4: Build product data with department references
  for (const data of rawData) {
    if (!departmentMap.has(data.department)) continue;

    products.push({
      id: Number(data.id),
      cost: parseFloat(data.cost),
      category: data.category,
      name: data.name,
      brand: data.brand,
      retail_price: parseFloat(data.retail_price),
      department: departmentMap.get(data.department),
      sku: data.sku,
      distribution_center_id: Number(data.distribution_center_id),
    });
  }

  // Step 5: Insert products
  if (products.length > 0) {
    await Product.insertMany(products, { ordered: false });
    console.log(`✅ Inserted ${products.length} products`);
  } else {
    console.log("⚠️ No products to insert");
  }
}

async function main() {
  try {
    await connectToMongo();
    await loadCSVData();
  } catch (err) {
    console.error("❌ Error:", err);
  } finally {
    await mongoose.disconnect();
    console.log("🔌 MongoDB disconnected");
  }
}

main();
