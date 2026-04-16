const Message = require('../models/Message');
const asyncHandler = require('../utils/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Get messages for a project
// @route   GET /api/messages/project/:projectId
// @access  Private
exports.getProjectMessages = asyncHandler(async (req, res, next) => {
  const messages = await Message.find({ projectId: req.params.projectId })
    .populate('sender', 'name role')
    .sort({ createdAt: 1 });

  res.status(200).json({
    success: true,
    data: messages
  });
});

// @desc    Send a message
// @route   POST /api/messages
// @access  Private
exports.sendMessage = asyncHandler(async (req, res, next) => {
  const { projectId, text, files } = req.body;
  
  const message = new Message({
    projectId,
    sender: req.user._id,
    text,
    files
  });

  await message.save();
  await message.populate('sender', 'name role');

  // Trigger socket event (handled via socket.io global later)
  if (global.io) {
    global.io.to(projectId.toString()).emit('newMessage', message);
  }

  res.status(201).json({
    success: true,
    data: message
  });
});
