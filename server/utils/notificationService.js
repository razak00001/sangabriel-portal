const Notification = require('../models/Notification');

/**
 * Trigger a notification for a user
 * @param {Object} params { recipient, sender, type, title, message, projectId }
 */
exports.createNotification = async ({ recipient, sender, type, title, message, projectId }) => {
  try {
    const notification = new Notification({
      recipient,
      sender,
      type,
      title,
      message,
      projectId
    });
    await notification.save();
    
    // In a real app, emit via Socket.io here as well
    // global.io.to(recipient.toString()).emit('newNotification', notification);
    
    return notification;
  } catch (error) {
    console.error('Error creating notification:', error);
  }
};
