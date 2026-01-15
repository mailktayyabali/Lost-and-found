import express from 'express';
const router = express.Router();
import {
  getUserProfile,
  getUserStats,
  getUserItems,
} from '../controllers/userController.js';
import { apiLimiter } from '../middleware/rateLimiter.js';
import { validateMongoId } from '../utils/validation.js';

// All routes are public
router.get('/:userId', apiLimiter, validateMongoId, getUserProfile);
router.get('/:userId/stats', apiLimiter, validateMongoId, getUserStats);
router.get('/:userId/items', apiLimiter, validateMongoId, getUserItems);

export default router;
