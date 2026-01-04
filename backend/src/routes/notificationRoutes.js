const express = require('express');
const router = express.Router();
const {
  getNotifications,
  markAsRead,
  markAllAsRead,
} = require('../controllers/notificationController');
const { authenticate } = require('../middleware/auth');
const { validateMongoId } = require('../utils/validation');

// All routes are protected
router.use(authenticate);

router.get('/', getNotifications);
router.put('/:id/read', validateMongoId, markAsRead);
router.put('/read-all', markAllAsRead);

module.exports = router;
