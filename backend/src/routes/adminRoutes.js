const express = require('express');
const router = express.Router();
const {
  getDashboardStats,
  getAllUsers,
  getAllItems,
  deleteUser,
  deleteItem,
  getActivityLog,
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
router.delete('/items/:id', apiLimiter, validateMongoId, deleteItem);
router.get('/activity', apiLimiter, getActivityLog);

module.exports = router;

