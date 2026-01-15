import express from 'express';
const router = express.Router();
import {
  getAlerts,
  createAlert,
  updateAlert,
  deleteAlert,
  checkMatches,
} from '../controllers/searchAlertController.js';
import { authenticate } from '../middleware/auth.js';
import { apiLimiter, createLimiter } from '../middleware/rateLimiter.js';
import { validateSearchAlert, validateMongoId } from '../utils/validation.js';

// All routes are protected
router.use(authenticate);

router.get('/', apiLimiter, getAlerts);
router.post('/', createLimiter, validateSearchAlert, createAlert);
router.put('/:id', createLimiter, validateMongoId, validateSearchAlert, updateAlert);
router.delete('/:id', apiLimiter, validateMongoId, deleteAlert);
router.get('/:id/check-matches', apiLimiter, validateMongoId, checkMatches);

export default router;
