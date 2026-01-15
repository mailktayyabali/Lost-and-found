import express from 'express';
const router = express.Router();
import {
  getReviews,
  createReview,
  updateReview,
  deleteReview,
} from '../controllers/reviewController.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { apiLimiter, createLimiter } from '../middleware/rateLimiter.js';
import { validateReviewCreation, validateMongoId } from '../utils/validation.js';

// Public route
router.get('/user/:userId', apiLimiter, validateMongoId, getReviews);

// Protected routes
router.post('/', authenticate, createLimiter, validateReviewCreation, createReview);
router.put('/:id', authenticate, createLimiter, validateMongoId, updateReview);
router.delete('/:id', authenticate, validateMongoId, deleteReview);

export default router;
