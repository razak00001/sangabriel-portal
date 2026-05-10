const Project = require('../models/Project');
const ActivityLog = require('../models/ActivityLog');
const Message = require('../models/Message');
const asyncHandler = require('../utils/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');

// Common logic for role-based project query
const getProjectQueryByRole = (user) => {
  if (user.role === 'Admin') return {};
  if (user.role === 'Project Manager') return {};
  if (user.role === 'Designer') return { designer: user._id };
  if (user.role === 'Installer') return { installer: user._id };
  if (user.role === 'Customer') return { teamMembers: user._id };
  return { _id: null }; // Default to nothing if role unknown
};

// @desc    Get dashboard stats
// @route   GET /api/dashboard/stats
// @access  Private
exports.getStats = asyncHandler(async (req, res, next) => {
  const query = getProjectQueryByRole(req.user);

  // Get project IDs for the unread messages query
  const projects = await Project.find(query).select('_id');
  const projectIds = projects.map(p => p._id);

  const [total, active, complete, unreadCount] = await Promise.all([
    Project.countDocuments(query),
    Project.countDocuments({ ...query, status: 'ACTIVE' }),
    Project.countDocuments({ ...query, status: 'COMPLETE' }),
    Message.countDocuments({
      projectId: { $in: projectIds },
      sender: { $ne: req.user._id },
      'readBy.user': { $ne: req.user._id }
    })
  ]);

  const stats = [
    { name: 'Total Projects', value: total, icon: 'FolderKanban', color: '#4f46e5' },
    { name: 'Active', value: active, icon: 'Clock', color: '#0ea5e9' },
    { name: 'Completed', value: complete, icon: 'CheckCircle2', color: '#10b981' },
    { name: 'Unread Messages', value: unreadCount, icon: 'MessageCircle', color: '#8b5cf6' }
  ];

  res.status(200).json({
    success: true,
    data: stats
  });
});

// @desc    Get recent projects
// @route   GET /api/dashboard/recent-projects
// @access  Private
exports.getRecentProjects = asyncHandler(async (req, res, next) => {
  const query = getProjectQueryByRole(req.user);
  
  const projects = await Project.find(query)
    .sort({ updatedAt: -1 })
    .limit(5)
    .populate('projectManager designer');

  res.status(200).json({
    success: true,
    data: projects
  });
});


// @desc    Get recent activity
// @route   GET /api/dashboard/activity
// @access  Private
exports.getRecentActivity = asyncHandler(async (req, res, next) => {
  const logs = await ActivityLog.find()
    .sort({ createdAt: -1 })
    .limit(10)
    .populate('user', 'name')
    .populate('projectId', 'title');

  res.status(200).json({
    success: true,
    data: logs
  });
});

// @desc    Get pending archive requests
// @route   GET /api/dashboard/archive-requests
// @access  Private/Admin
exports.getArchiveRequests = asyncHandler(async (req, res, next) => {
  const ArchiveRequest = require('../models/ArchiveRequest');
  const requests = await ArchiveRequest.find({ status: 'PENDING' })
    .sort({ createdAt: -1 })
    .populate('requestedBy', 'name')
    .populate('projectId', 'title');

  res.status(200).json({
    success: true,
    data: requests
  });
});
