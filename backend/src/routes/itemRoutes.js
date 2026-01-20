import express from 'express';
const router = express.Router();
import {
  getAllItems,
  getItemById,
  createItem,
  updateItem,
  deleteItem,
  markAsResolved,
  getUserItems,
  searchItems,

} from '../controllers/itemController.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { createLimiter, apiLimiter } from '../middleware/rateLimiter.js';
import { validateItemCreation, validateMongoId } from '../utils/validation.js';
import { uploadMultiple } from '../middleware/upload.js';

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

export default router;

