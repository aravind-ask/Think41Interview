import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  cost: Number,
  category: String,
  name: String,
  brand: String,
  retail_price: Number,
  department: String,
  sku: String,
  distribution_center_id: Number,
});

const Product = mongoose.model("Product", productSchema);
export default Product;
