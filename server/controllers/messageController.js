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

// @desc    Mark messages as read
// @route   PATCH /api/messages/project/:projectId/read
// @access  Private
exports.markProjectMessagesAsRead = asyncHandler(async (req, res, next) => {
  await Message.updateMany(
    { 
      projectId: req.params.projectId, 
      'readBy.user': { $ne: req.user._id } 
    },
    { 
      $push: { readBy: { user: req.user._id, readAt: Date.now() } } 
    }
  );

  res.status(200).json({ success: true });
});

// Helper for @mentions (simplified regex for now)
const parseMentions = async (text) => {
  const mentionRegex = /@(\w+)/g;
  const matches = text.match(mentionRegex);
  if (!matches) return [];
  
  const names = matches.map(m => m.slice(1));
  const User = require('../models/User');
  const users = await User.find({ name: { $in: names } }).select('_id');
  return users.map(u => u._id);
};

// @desc    Send a message (Updated with mentions)
exports.sendMessage = asyncHandler(async (req, res, next) => {
  const { projectId, content, isInternal, attachments } = req.body;
  
  const mentions = await parseMentions(content);
  
  const message = new Message({
    projectId,
    sender: req.user._id,
    content,
    isInternal,
    attachments,
    mentions
  });

  await message.save();
  await message.populate('sender', 'name role');

  // Trigger notifications for @mentions
  if (mentions && mentions.length > 0) {
    const { createNotification } = require('../utils/notificationService');
    for (const userId of mentions) {
      await createNotification({
        recipient: userId,
        sender: req.user._id,
        type: 'STATUS_CHANGE', // Or a new 'MENTION' type if defined
        title: 'You were mentioned',
        message: `${req.user.name} mentioned you in a project chat.`,
        projectId
      });
    }
  }

  // Phase 1 Automation: ACTIVE -> IN PROGRESS on Designer interaction
  const Project = require('../models/Project');
  const project = await Project.findById(projectId);
  if (project && project.status === 'ACTIVE' && req.user.role === 'Designer') {
    project.status = 'IN PROGRESS';
    await project.save();
    
    // Log status change activity
    const ActivityLog = require('../models/ActivityLog');
    await ActivityLog.create({
      projectId,
      user: req.user._id,
      action: 'Status Updated',
      details: { from: 'ACTIVE', to: 'IN PROGRESS', trigger: 'First Designer Message' }
    });
  }

  // Trigger socket event (handled via socket.io global later)
  if (global.io) {
    global.io.to(projectId.toString()).emit('newMessage', message);
    if (project && project.status === 'IN PROGRESS') {
        global.io.to(projectId.toString()).emit('projectUpdated', project);
    }
  }

  res.status(201).json({
    success: true,
    data: message
  });
});
