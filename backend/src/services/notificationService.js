const Notification = require('../models/Notification');
const { sendMatchNotification, sendMessageNotification } = require('./emailService');

// Create in-app notification
const createNotification = async (userId, type, title, message, data = {}) => {
  try {
    const notification = await Notification.create({
      recipient: userId,
      type,
      title,
      message,
      data,
    });
    return notification;
  } catch (error) {
    console.error(`Failed to create notification for user ${userId}:`, error.message);
    return null;
  }
};



// Send email notification
const sendEmailNotification = async (user, type, data) => {
  try {
    switch (type) {
      case 'match':
        return await sendMatchNotification(user, data.item);
      case 'message':
        return await sendMessageNotification(user, data.sender, data.item);
      default:
        console.log(`Unknown notification type: ${type}`);
        return false;
    }
  } catch (error) {
    console.error(`Email notification failed: ${error.message}`);
    return false;
  }
};

module.exports = {
  createNotification,

  sendEmailNotification,
};

