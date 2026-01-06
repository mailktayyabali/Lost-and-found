const express = require('express');
const router = express.Router();
const {
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
} = require('../controllers/adminController');
const { authenticate, authorize } = require('../middleware/auth');
const { apiLimiter } = require('../middleware/rateLimiter');
const { validateMongoId } = require('../utils/validation');

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

module.exports = router;
