import mongoose from "mongoose";

const departmentSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: { type: String, required: true, unique: true },
});

const Department = mongoose.model("Department", departmentSchema);
export default Department;
