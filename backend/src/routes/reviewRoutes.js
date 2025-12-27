const express = require('express');
const router = express.Router();
const {
  getReviews,
  createReview,
  updateReview,
  deleteReview,
} = require('../controllers/reviewController');
const { authenticate, authorize } = require('../middleware/auth');
const { apiLimiter, createLimiter } = require('../middleware/rateLimiter');
const { validateReviewCreation, validateMongoId } = require('../utils/validation');

// Public route
router.get('/user/:userId', apiLimiter, validateMongoId, getReviews);

// Protected routes
router.post('/', authenticate, createLimiter, validateReviewCreation, createReview);
router.put('/:id', authenticate, createLimiter, validateMongoId, updateReview);
router.delete('/:id', authenticate, validateMongoId, deleteReview);

module.exports = router;

