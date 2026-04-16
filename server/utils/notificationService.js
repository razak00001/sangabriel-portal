const Notification = require('../models/Notification');
const User = require('../models/User');
const { sendProjectNotificationEmail } = require('./emailService');

/**
 * Trigger a notification for a user and optionally send an email
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
    
    // Fetch recipient details to send email
    const recipientUser = await User.findById(recipient);
    
    if (recipientUser && recipientUser.email) {
      // Send email for high-priority events
      const emailEvents = ['ASSIGNMENT', 'STATUS_CHANGE', 'REVISION_REQUEST', 'PROJECT_COMPLETE'];
      
      if (emailEvents.includes(type)) {
        await sendProjectNotificationEmail(recipientUser, title, message);
      }
    }
    
    // Socket.io integration would go here
    if (global.io) {
      global.io.to(recipient.toString()).emit('newNotification', notification);
    }
    
    return notification;
  } catch (error) {
    console.error('Error creating notification:', error);
  }
};
