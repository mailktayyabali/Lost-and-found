const express = require('express');
const router = express.Router();
const {
  getUserProfile,
  getUserStats,
  getUserItems,
} = require('../controllers/userController');
const { apiLimiter } = require('../middleware/rateLimiter');
const { validateMongoId } = require('../utils/validation');

// All routes are public
router.get('/:userId', apiLimiter, validateMongoId, getUserProfile);
router.get('/:userId/stats', apiLimiter, validateMongoId, getUserStats);
router.get('/:userId/items', apiLimiter, validateMongoId, getUserItems);

module.exports = router;

