const Project = require('../models/Project');
const asyncHandler = require('../utils/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Get project profitability report
// @route   GET /api/reports/profitability/:projectId
// @access  Private/Admin
exports.getProjectProfitability = asyncHandler(async (req, res, next) => {
  const project = await Project.findById(req.params.projectId);

  if (!project) {
    return next(new ErrorResponse('Project not found', 404));
  }

  // Example logic for profitability
  const designCost = project.milestones.filter(m => m.completed).length * 100; // Mock logic 
  const totalInvoiced = project.budget || 0;
  
  const report = {
    projectId: project._id,
    title: project.title,
    budget: totalInvoiced,
    estimatedCost: designCost,
    margin: totalInvoiced - designCost
  };

  res.status(200).json({
    success: true,
    data: report
  });
});

// @desc    Get revenue report
// @route   GET /api/reports/revenue
// @access  Private/Accounting/Admin
exports.getRevenueReport = asyncHandler(async (req, res, next) => {
  const { startDate, endDate, customerId } = req.query;
  
  const match = { status: { $in: ['BILLED', 'COMPLETE'] } };
  
  if (startDate || endDate) {
    match.createdAt = {};
    if (startDate) match.createdAt.$gte = new Date(startDate);
    if (endDate) match.createdAt.$lte = new Date(endDate);
  }
  
  if (customerId) {
    match.clientName = customerId; // Or project.client reference
  }

  const revenue = await Project.aggregate([
    { $match: match },
    {
      $group: {
        _id: {
          year: { $year: "$createdAt" },
          month: { $month: "$createdAt" }
        },
        totalRevenue: { $sum: "$budget" },
        projectCount: { $sum: 1 }
      }
    },
    { $sort: { "_id.year": -1, "_id.month": -1 } }
  ]);

  res.status(200).json({
    success: true,
    data: revenue
  });
});

// @desc    Get global performance stats
// @route   GET /api/reports/performance
// @access  Private/Admin
exports.getGlobalPerformance = asyncHandler(async (req, res, next) => {
  const [complete, active, billed] = await Promise.all([
    Project.countDocuments({ status: 'COMPLETE' }),
    Project.countDocuments({ status: 'ACTIVE' }),
    Project.countDocuments({ status: 'BILLED' })
  ]);

  res.status(200).json({
    success: true,
    data: {
      completionRate: (complete / (complete + active || 1) * 100).toFixed(2),
      activeProjects: active,
      billedVolume: billed
    }
  });
});

// @desc    Get workload distribution (Heatmap data)
// @route   GET /api/reports/workload
// @access  Private/Admin
exports.getWorkloadDistribution = asyncHandler(async (req, res, next) => {
  const distribution = await Project.aggregate([
    { $match: { status: { $ne: 'ARCHIVED' } } },
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 },
        projects: { $push: { title: "$title", pm: "$projectManager" } }
      }
    }
  ]);

  res.status(200).json({
    success: true,
    data: distribution
  });
});
