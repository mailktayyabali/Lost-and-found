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

// Debug logger for create item requests (placed after multer so req.files is available)
const logCreateItem = (req, res, next) => {
  try {
    console.log('POST /items incoming:', {
      user: req.user ? req.user.id : null,
      contentType: req.headers['content-type'],
      bodyKeys: Object.keys(req.body || {}),
      fileCount: req.files ? req.files.length : 0,
    });
  } catch (e) {
    console.error('logCreateItem error', e);
  }
  next();
};
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
  logCreateItem,
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

