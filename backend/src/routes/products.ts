import express from 'express';
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getUserProducts,
} from '../controllers/productsController';
import { authMiddleware } from '../middleware/auth';

const router = express.Router();

router.get('/', getProducts);
router.get('/:id', getProductById);
router.get('/user/:userId', getUserProducts);
router.post('/', authMiddleware, createProduct);
router.put('/:id', authMiddleware, updateProduct);
router.delete('/:id', authMiddleware, deleteProduct);

export default router;
