const Message = require('../models/Message');
const Conversation = require('../models/Conversation');
const Item = require('../models/Item');
const { sendSuccess } = require('../utils/response');
const { NotFoundError, ForbiddenError } = require('../utils/errors');
const { getPaginationParams, getPaginationMeta } = require('../utils/pagination');
const { sendMessageNotification } = require('../services/emailService');
const User = require('../models/User');
const { transformMessage, transformConversation, transformItem } = require('../utils/transformers');
const { getIo } = require('../services/socketService');

// Get all user conversations
const getConversations = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const conversations = await Conversation.find({
      participants: userId,
    })
      .populate('item', 'title status images')
      .populate('participants', 'name username avatar')
      .populate('lastMessage')
      .sort({ lastMessageAt: -1, updatedAt: -1 });

    sendSuccess(res, 'Conversations retrieved successfully', {
      conversations: conversations.map((conv) => transformConversation(conv, userId)),
    });
  } catch (error) {
    next(error);
  }
};

// Get single conversation with messages
const getConversation = async (req, res, next) => {
  try {
    const { conversationId } = req.params;
    const userId = req.user.id;

    const conversation = await Conversation.findById(conversationId)
      .populate('item', 'title status images postedBy')
      .populate('participants', 'name username avatar');

    if (!conversation) {
      throw new NotFoundError('Conversation');
    }

    // Check if user is participant
    const isParticipant = conversation.participants.some(
      (p) => p._id.toString() === userId.toString()
    );
    if (!isParticipant) {
      throw new ForbiddenError('Not authorized to view this conversation');
    }

    // Get messages
    const { page, limit, skip } = getPaginationParams(req.query);
    const messages = await Message.find({ conversation: conversationId })
      .populate('sender', 'name username avatar email')
      .populate('receiver', 'name username avatar email')
      .populate({
        path: 'conversation',
        select: 'item',
        populate: {
          path: 'item',
          select: '_id',
        },
      })
      .sort({ createdAt: 1 })
      .skip(skip)
      .limit(limit);

    const total = await Message.countDocuments({ conversation: conversationId });

    // Mark messages as read
    await Message.updateMany(
      {
        conversation: conversationId,
        receiver: userId,
        read: false,
      },
      {
        read: true,
        readAt: new Date(),
      }
    );

    sendSuccess(res, 'Conversation retrieved successfully', {
      conversation: {
        ...transformConversation(conversation, userId),
        messages: messages.map((msg) => transformMessage(msg, req.user.email)),
        pagination: getPaginationMeta(page, limit, total),
      },
    });
  } catch (error) {
    next(error);
  }
};

// Send message
const sendMessage = async (req, res, next) => {
  try {
    const { conversationId, receiverId, content } = req.body;
    const senderId = req.user.id;

    // Find or create conversation
    let conversation = await Conversation.findOne({
      item: req.body.itemId,
      participants: { $all: [senderId, receiverId] },
    });

    if (!conversation) {
      // Create new conversation
      conversation = await Conversation.create({
        item: req.body.itemId,
        participants: [senderId, receiverId],
      });
    }

    // Create message
    const message = await Message.create({
      conversation: conversation._id,
      sender: senderId,
      receiver: receiverId,
      content,
    });

    // Update conversation
    conversation.lastMessage = message._id;
    conversation.lastMessageAt = new Date();
    await conversation.save();

    // Populate message with itemId for frontend
    await message.populate('sender', 'name username avatar email');
    await message.populate('receiver', 'name username avatar email');
    await message.populate({
      path: 'conversation',
      select: 'item',
      populate: {
        path: 'item',
        select: '_id',
      },
    });
    // Add itemId directly to message object for transformer
    message.itemId = req.body.itemId || conversation.item?.toString();
    
    // Transform message
    const transformedMessage = transformMessage(message, req.user.email);

    // Send via socket (emit to conversation room and receiver's user room)
    try {
      const io = getIo();
      const convRoom = conversation._id.toString();
      console.log(`Emitting message ${transformedMessage.id} to conversation room ${convRoom} and user_${receiverId}`);
      io.to(convRoom).emit('receive_message', transformedMessage);
      // Also emit directly to receiver's personal room in case they're not joined to convo yet
      try {
        io.to(`user_${receiverId.toString()}`).emit('receive_message', transformedMessage);
      } catch (innerErr) {
        console.error('Emit to user room failed:', innerErr);
      }
    } catch (err) {
      console.error('Socket emit failed:', err);
    }

    // Send notification email (non-blocking)
    const receiver = await User.findById(receiverId);
    const item = await Item.findById(req.body.itemId);
    if (receiver && item) {
      sendMessageNotification(receiver, req.user, item).catch((err) =>
        console.error('Message notification email failed:', err)
      );
    }

    sendSuccess(res, 'Message sent successfully', { 
      message: transformedMessage 
    }, 201);
  } catch (error) {
    next(error);
  }
};

// Mark messages as read
const markAsRead = async (req, res, next) => {
  try {
    const { messageId } = req.params;
    const userId = req.user.id;

    const message = await Message.findById(messageId);
    if (!message) {
      throw new NotFoundError('Message');
    }

    // Check if user is receiver
    if (message.receiver.toString() !== userId) {
      throw new ForbiddenError('Not authorized to mark this message as read');
    }

    message.read = true;
    message.readAt = new Date();
    await message.save();
    await message.populate('sender', 'name username avatar email');
    await message.populate('receiver', 'name username avatar email');

    sendSuccess(res, 'Message marked as read', { 
      message: transformMessage(message, req.user.email) 
    });
  } catch (error) {
    next(error);
  }
};

// Get unread message count
const getUnreadCount = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const count = await Message.countDocuments({
      receiver: userId,
      read: false,
    });

    sendSuccess(res, 'Unread count retrieved', { unreadCount: count });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getConversations,
  getConversation,
  sendMessage,
  markAsRead,
  getUnreadCount,
};

