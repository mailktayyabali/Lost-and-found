import Notification from '../models/Notification.js';
import { sendSuccess } from '../utils/response.js';
import { NotFoundError } from '../utils/errors.js';
import { getPaginationParams, getPaginationMeta } from '../utils/pagination.js';
import { transformNotification } from '../utils/transformers.js';

// Get user's notifications
const getNotifications = async (req, res, next) => {
  try {
    const { page, limit, skip } = getPaginationParams(req.query);
    const userId = req.user.id;
    const unreadOnly = req.query.unreadOnly === 'true';

    const query = { recipient: userId };
    if (unreadOnly) {
      query.read = false;
    }

    const notifications = await Notification.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      // Populate related data if needed, e.g., sender name, item title
      .populate('data.senderId', 'name avatar') 
      .populate('data.itemId', 'title') 
      .populate('data.alertId', 'name');

    const total = await Notification.countDocuments(query);
    
    // Quick unread count for the UI badge
    const unreadCount = await Notification.countDocuments({ recipient: userId, read: false });

    sendSuccess(res, 'Notifications retrieved successfully', {
      notifications, // TODO: Apply transformNotification if needed
      unreadCount,
      pagination: getPaginationMeta(page, limit, total),
    });
  } catch (error) {
    next(error);
  }
};

// Mark notification as read
const markAsRead = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const notification = await Notification.findOne({ _id: id, recipient: userId });
    if (!notification) {
      throw new NotFoundError('Notification');
    }

    notification.read = true;
    await notification.save();

    sendSuccess(res, 'Notification marked as read', { notification });
  } catch (error) {
    next(error);
  }
};

// Mark all as read
const markAllAsRead = async (req, res, next) => {
  try {
    const userId = req.user.id;

    await Notification.updateMany(
      { recipient: userId, read: false },
      { $set: { read: true } }
    );

    sendSuccess(res, 'All notifications marked as read');
  } catch (error) {
    next(error);
  }
};

export {
  getNotifications,
  markAsRead,
  markAllAsRead,
};
