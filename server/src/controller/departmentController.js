import Department from "../models/Departments.js";
import Product from "../models/Products.js";

export const getDepartments = async (req, res) => {
  try {
    const departments = await Department.find();
    res.status(200).json(departments);
  } catch (error) {
    console.error("Error fetching departments:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getDepartmentById = async (req, res) => {
  try {
    const departmentId = req.params.id;
    const department = await Department.findById(departmentId);
    if (!department) {
      return res.status(404).json({ message: "Department not found" });
    }
    res.status(200).json(department);
  } catch (error) {
    console.error("Error fetching department by ID:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getProducts = async (req, res) => {
  try {
    const departmentId = req.params.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const department = await Department.findById(departmentId);
    if (!department) {
      return res.status(404).json({ message: "Department not found" });
    }

    const total = await Product.countDocuments({ department: departmentId });
    const products = await Product.find({ department: departmentId })
      .skip(skip)
      .limit(limit);

    if (!products || products.length === 0) {
      return res
        .status(404)
        .json({ message: "No products found for this department" });
    }
    res.status(200).json({
      products,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("Error fetching products for department:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
