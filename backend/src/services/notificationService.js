const { sendMatchNotification, sendMessageNotification } = require('./emailService');

// Create in-app notification (stored in database - future implementation)
const createNotification = async (userId, type, message, data = {}) => {
  // TODO: Implement notification model and storage
  // For now, just log the notification
  console.log(`Notification for user ${userId}: ${type} - ${message}`);
  return { userId, type, message, data, createdAt: new Date() };
};

// Send push notification (future implementation)
const sendPushNotification = async (userId, title, body, data = {}) => {
  // TODO: Implement push notification service (FCM, OneSignal, etc.)
  console.log(`Push notification for user ${userId}: ${title} - ${body}`);
  return true;
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
  sendPushNotification,
  sendEmailNotification,
};

