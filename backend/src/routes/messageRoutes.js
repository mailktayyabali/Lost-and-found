const express = require('express');
const router = express.Router();
const {
  getConversations,
  getConversation,
  sendMessage,
  markAsRead,
  getUnreadCount,
} = require('../controllers/messageController');
const { authenticate } = require('../middleware/auth');
const { apiLimiter, createLimiter } = require('../middleware/rateLimiter');
const { validateMessage, validateMongoId } = require('../utils/validation');

// All routes are protected
router.use(authenticate);

router.get('/conversations', apiLimiter, getConversations);
router.get('/conversations/:conversationId', apiLimiter, validateMongoId, getConversation);
router.post('/', createLimiter, validateMessage, sendMessage);
router.put('/:messageId/read', apiLimiter, validateMongoId, markAsRead);
router.get('/unread-count', apiLimiter, getUnreadCount);

module.exports = router;

