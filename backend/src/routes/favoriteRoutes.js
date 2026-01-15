import express from 'express';
const router = express.Router();
import {
  getFavorites,
  addFavorite,
  removeFavorite,
  checkFavorite,
} from '../controllers/favoriteController.js';
import { authenticate } from '../middleware/auth.js';
import { apiLimiter } from '../middleware/rateLimiter.js';
import { validateMongoId } from '../utils/validation.js';

// All routes are protected
router.use(authenticate);

router.get('/', apiLimiter, getFavorites);
router.post('/:itemId', apiLimiter, validateMongoId, addFavorite);
router.delete('/:itemId', apiLimiter, validateMongoId, removeFavorite);
router.get('/check/:itemId', apiLimiter, validateMongoId, checkFavorite);

export default router;

