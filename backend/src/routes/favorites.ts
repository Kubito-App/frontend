import express from 'express';
import {
  getFavorites,
  addFavorite,
  removeFavorite,
  checkFavorite,
} from '../controllers/favoritesController';
import { authMiddleware } from '../middleware/auth';

const router = express.Router();

router.get('/', authMiddleware, getFavorites);
router.post('/', authMiddleware, addFavorite);
router.delete('/:productId', authMiddleware, removeFavorite);
router.get('/check/:productId', authMiddleware, checkFavorite);

export default router;
