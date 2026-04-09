const Message = require('../models/Message');
const User = require('../models/User');
const { createNotification } = require('../utils/notificationService');

exports.saveMessage = async (data) => {
  try {
    const message = new Message({
      projectId: data.projectId,
      sender: data.senderId,
      content: data.content,
      isInternal: data.isInternal !== undefined ? data.isInternal : true
    });
    await message.save();

    // Parse for mentions (@Name)
    const mentionRegex = /@(\w+)/g;
    const matches = data.content.match(mentionRegex);
    if (matches) {
      for (const match of matches) {
        const name = match.substring(1);
        const user = await User.findOne({ name: new RegExp(`^${name}`, 'i') });
        if (user) {
          await createNotification({
            recipient: user._id,
            sender: data.senderId,
            type: 'CHAT_MESSAGE',
            title: 'You were mentioned',
            message: `User mentioned you in a project chat: "${data.content.substring(0, 50)}..."`,
            projectId: data.projectId
          });
        }
      }
    }

    return await message.populate('sender');
  } catch (error) {
    console.error('Error saving message:', error);
    return null;
  }
};

exports.getProjectMessages = async (req, res) => {
  try {
    const { projectId } = req.params;
    let query = { projectId };
    
    // Customers cannot see internal messages
    if (req.user.role === 'Customer') {
      query.isInternal = false;
    }

    const messages = await Message.find(query)
      .populate('sender')
      .sort({ createdAt: 1 });
    res.send(messages);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};
