import express from 'express';
const router = express.Router();
import {
  getNotifications,
  markAsRead,
  markAllAsRead,
} from '../controllers/notificationController.js';
import { authenticate } from '../middleware/auth.js';
import { validateMongoId } from '../utils/validation.js';

// All routes are protected
router.use(authenticate);

router.get('/', getNotifications);
router.put('/:id/read', validateMongoId, markAsRead);
router.put('/read-all', markAllAsRead);

export default router;
