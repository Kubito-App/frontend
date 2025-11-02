import express from 'express';
import {
  getPromotions,
  getPromotionById,
  createPromotion,
  updatePromotion,
  deletePromotion,
  trackImpression,
  trackClick,
} from '../controllers/promotionsController';
import { authMiddleware } from '../middleware/auth';

const router = express.Router();

router.get('/', authMiddleware, getPromotions);
router.get('/:id', authMiddleware, getPromotionById);
router.post('/', authMiddleware, createPromotion);
router.put('/:id', authMiddleware, updatePromotion);
router.delete('/:id', authMiddleware, deletePromotion);
router.post('/:id/impression', trackImpression);
router.post('/:id/click', trackClick);

export default router;
