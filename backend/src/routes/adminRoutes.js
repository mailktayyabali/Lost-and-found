import express from 'express';
const router = express.Router();
import {
  getDashboardStats,
  getAllUsers,
  getAllItems,
  deleteUser,
  deleteItem,
  getActivityLog,
  banUser,
  unbanUser,
  getFlags,
  updateFlagStatus
} from '../controllers/adminController.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { apiLimiter } from '../middleware/rateLimiter.js';
import { validateMongoId } from '../utils/validation.js';

// All routes are admin only
router.use(authenticate);
router.use(authorize('admin'));

router.get('/stats', apiLimiter, getDashboardStats);
router.get('/users', apiLimiter, getAllUsers);
router.get('/items', apiLimiter, getAllItems);
router.delete('/users/:id', apiLimiter, validateMongoId, deleteUser);
router.patch('/users/:id/ban', apiLimiter, validateMongoId, banUser);
router.patch('/users/:id/unban', apiLimiter, validateMongoId, unbanUser);
router.delete('/items/:id', apiLimiter, validateMongoId, deleteItem);
router.get('/activity', apiLimiter, getActivityLog);

// Flag routes
router.get('/flags', apiLimiter, getFlags);
router.patch('/flags/:id', apiLimiter, validateMongoId, updateFlagStatus);

export default router;
