import express from 'express';
const router = express.Router();
import {
  getConversations,
  getConversation,
  sendMessage,
  markAsRead,
  getUnreadCount,
  deleteConversation,
} from '../controllers/messageController.js';
import { authenticate } from '../middleware/auth.js';
import { apiLimiter, createLimiter } from '../middleware/rateLimiter.js';
import { validateMessage, validateMongoId } from '../utils/validation.js';

// All routes are protected
router.use(authenticate);

router.get('/conversations', apiLimiter, getConversations);
router.get('/conversations/:conversationId', apiLimiter, validateMongoId, getConversation);
router.post('/', createLimiter, validateMessage, sendMessage);
router.put('/:messageId/read', apiLimiter, validateMongoId, markAsRead);
router.get('/unread-count', apiLimiter, getUnreadCount);
router.delete('/conversations/:conversationId', apiLimiter, validateMongoId, deleteConversation);

export default router;

