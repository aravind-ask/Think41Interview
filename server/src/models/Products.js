import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  id: { 
    type: Number, 
    required: true, 
    unique: true,
    validate: {
      validator: Number.isInteger,
      message: props => `${props.value} is not an integer value`
    },
    min: [1, 'id must be a positive integer']
  },
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
