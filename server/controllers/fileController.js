const File = require('../models/File');
const Project = require('../models/Project');
const asyncHandler = require('../utils/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');
const { deleteFromS3 } = require('../utils/s3');

// @desc    Get files for a project
// @route   GET /api/files/project/:projectId
// @access  Private
exports.getProjectFiles = asyncHandler(async (req, res, next) => {
  const files = await File.find({ projectId: req.params.projectId })
    .populate('uploadedBy', 'name role')
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    data: files
  });
});

// @desc    Upload a file
// @route   POST /api/files/upload
// @access  Private
exports.uploadFile = asyncHandler(async (req, res, next) => {
  if (!req.file) {
    return next(new ErrorResponse('Please upload a file', 400));
  }

  const { projectId, tag } = req.body;

  const file = new File({
    originalName: req.file.originalname,
    fileName: req.file.key,
    url: req.file.location,
    key: req.file.key,
    size: req.file.size,
    mimeType: req.file.mimetype,
    projectId,
    uploadedBy: req.user._id,
    tag: tag || 'Document'
  });

  await file.save();

  // Add file to project's files array (optional, dependining on if you want it tracked in Project model too)
  await Project.findByIdAndUpdate(projectId, {
    $push: { files: file._id }
  });

  res.status(201).json({
    success: true,
    data: file
  });
});

// @desc    Delete a file
// @route   DELETE /api/files/:id
// @access  Private
exports.deleteFile = asyncHandler(async (req, res, next) => {
  const file = await File.findById(req.params.id);

  if (!file) {
    return next(new ErrorResponse('File not found', 404));
  }

  // Delete from S3
  await deleteFromS3(file.key);

  // Delete from DB
  await file.deleteOne();

  // Remove from Project array
  await Project.findByIdAndUpdate(file.projectId, {
    $pull: { files: file._id }
  });

  res.status(200).json({
    success: true,
    data: {}
  });
});
