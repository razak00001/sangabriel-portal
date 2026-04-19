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

  // Phase 4: File Versioning logic
  const lastVersion = await File.findOne({ 
    projectId, 
    originalName: req.file.originalname 
  }).sort({ version: -1 });

  const file = new File({
    originalName: req.file.originalname,
    fileName: req.file.key,
    url: req.file.location,
    key: req.file.key,
    size: req.file.size,
    mimeType: req.file.mimetype,
    projectId,
    uploadedBy: req.user._id,
    tag: tag || 'Document',
    version: lastVersion ? lastVersion.version + 1 : 1,
    parentFileId: lastVersion ? (lastVersion.parentFileId || lastVersion._id) : null
  });

  await file.save();

  await file.save();
  
  const project = await Project.findById(projectId);
  if (project) {
    let statusChanged = false;
    const oldStatus = project.status;
    let transitionReason = '';

    // Phase 1 Automation: ACTIVE -> IN PROGRESS on Designer upload
    if (project.status === 'ACTIVE' && req.user.role === 'Designer') {
      project.status = 'IN PROGRESS';
      statusChanged = true;
      transitionReason = 'First Designer File Upload';
    }

    // Phase 1 Automation: Any -> PENDING REVIEW on "Delivery" tag upload
    if (tag === 'Delivery' && project.status !== 'PENDING REVIEW') {
      project.status = 'PENDING REVIEW';
      statusChanged = true;
      transitionReason = 'Production Delivery Uploaded';
    }

    if (statusChanged) {
      await project.save();
      const ActivityLog = require('../models/ActivityLog');
      await ActivityLog.create({
        projectId,
        user: req.user._id,
        action: 'Status Updated',
        details: { from: oldStatus, to: project.status, trigger: transitionReason }
      });
      
      if (global.io) {
        global.io.to(projectId.toString()).emit('projectUpdated', project);
      }
    }

    // Add file to project's files array
    project.files.push(file._id);
    await project.save();
  }

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
