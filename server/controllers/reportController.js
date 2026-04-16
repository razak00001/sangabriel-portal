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
