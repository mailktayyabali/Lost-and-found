const express = require('express');
const router = express.Router();
const {
  getAllItems,
  getItemById,
  createItem,
  updateItem,
  deleteItem,
  markAsResolved,
  getUserItems,
  searchItems,
  incrementViews,
} = require('../controllers/itemController');
const { authenticate, authorize } = require('../middleware/auth');
const { createLimiter, apiLimiter } = require('../middleware/rateLimiter');
const { validateItemCreation, validateMongoId } = require('../utils/validation');
const { uploadMultiple } = require('../middleware/upload');

// Public routes
router.get('/', apiLimiter, getAllItems);
router.get('/search', apiLimiter, searchItems);
router.get('/:id', apiLimiter, validateMongoId, getItemById);
router.post('/:id/view', apiLimiter, validateMongoId, incrementViews);
router.get('/user/:userId', apiLimiter, getUserItems);

// Protected routes
router.post(
  '/',
  authenticate,
  createLimiter,
  uploadMultiple,
  validateItemCreation,
  createItem
);
router.put(
  '/:id',
  authenticate,
  createLimiter,
  validateMongoId,
  uploadMultiple,
  updateItem
);
router.delete('/:id', authenticate, validateMongoId, deleteItem);
router.patch('/:id/resolve', authenticate, validateMongoId, markAsResolved);

module.exports = router;

