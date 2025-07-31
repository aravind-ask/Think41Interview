import express from 'express';
import { getDepartments, getDepartmentById, getProducts } from '../controller/departmentController.js';

const router = express.Router();

router.get('/', getDepartments);
router.get('/:id', getDepartmentById);
router.get('/:id/products', getProducts);

export default router;