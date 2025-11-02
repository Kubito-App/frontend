import express from 'express';
import {
  getUserProfile,
  updateUserProfile,
  updateSubscription,
} from '../controllers/usersController';
import { authMiddleware } from '../middleware/auth';

const router = express.Router();

router.get('/:userId', getUserProfile);
router.put('/profile', authMiddleware, updateUserProfile);
router.put('/subscription', authMiddleware, updateSubscription);

export default router;
