import Product from "../models/Products.js";
import Department from "../models/Departments.js";

export const getProducts = async (req, res) => {
  try {
    const products = await Product.find({}).limit(10);
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getProductById = async (req, res) => {
  try {
    const productId = req.params.id;
    const product = await Product.findOne({ id: productId }).populate("department");
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json(product);
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: error.message });
  }
};
