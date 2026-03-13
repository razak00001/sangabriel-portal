const Message = require('../models/Message');

exports.saveMessage = async (data) => {
  try {
    const message = new Message({
      projectId: data.projectId,
      sender: data.senderId,
      content: data.content,
      isInternal: data.isInternal !== undefined ? data.isInternal : true
    });
    await message.save();
    return await message.populate('sender');
  } catch (error) {
    console.error('Error saving message:', error);
    return null;
  }
};

exports.getProjectMessages = async (req, res) => {
  try {
    const { projectId } = req.params;
    const messages = await Message.find({ projectId })
      .populate('sender')
      .sort({ createdAt: 1 });
    res.send(messages);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};
