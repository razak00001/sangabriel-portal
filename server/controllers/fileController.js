const File = require('../models/File');
const Project = require('../models/Project');
const ActivityLog = require('../models/ActivityLog');
const { createNotification } = require('../utils/notificationService');

exports.uploadFile = async (req, res) => {
  try {
    const { projectId, tag } = req.body;
    if (!req.file) {
      return res.status(400).send({ error: 'No file uploaded' });
    }

    let version = 1;
    let parentFileId = req.body.parentFileId;

    if (parentFileId) {
      const parentFile = await File.findById(parentFileId);
      if (parentFile) {
        // Find latest version in this chain
        const latestVersion = await File.findOne({ 
          $or: [{ _id: parentFileId }, { parentFileId: parentFileId }] 
        }).sort({ version: -1 });
        version = (latestVersion ? latestVersion.version : parentFile.version) + 1;
      }
    }

    const file = new File({
      originalName: req.file.originalname,
      fileName: req.file.filename || req.file.key,
      url: req.file.location || `/uploads/${req.file.filename}`, 
      key: req.file.key || req.file.filename,
      size: req.file.size,
      mimeType: req.file.mimetype,
      projectId,
      uploadedBy: req.user._id,
      tag: tag || 'Document',
      version,
      parentFileId
    });

    await file.save();

    // Update Project and Log Activity
    const projectUpdate = { $push: { files: file._id } };
    
    // Auto -> PENDING REVIEW upon delivery upload by Designer
    if (req.user.role === 'Designer') {
      projectUpdate.status = 'PENDING REVIEW';
    }
    
    await Project.findByIdAndUpdate(projectId, projectUpdate);

    const log = new ActivityLog({
      projectId,
      user: req.user._id,
      action: 'File Uploaded',
      details: { fileName: file.originalName, tag: file.tag }
    });
    await log.save();

    // Notify Project Manager and others
    const project = await Project.findById(projectId);
    const recipients = [];
    if (project.projectManager) recipients.push(project.projectManager);
    if (project.designer) recipients.push(project.designer);
    if (project.installer) recipients.push(project.installer);
    if (project.teamMembers) recipients.push(...project.teamMembers);

    for (const recipient of [...new Set(recipients)]) {
      if (recipient.toString() !== req.user._id.toString()) {
        await createNotification({
          recipient,
          sender: req.user._id,
          type: 'FILE_UPLOAD',
          title: 'New File Uploaded',
          message: `User ${req.user.name} uploaded "${file.originalName}" to project "${project.title}"`,
          projectId
        });
      }
    }

    res.status(201).send(file);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};

exports.getProjectFiles = async (req, res) => {
  try {
    const { projectId } = req.params;
    const files = await File.find({ projectId }).populate('uploadedBy');
    res.send(files);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

exports.deleteFile = async (req, res) => {
  try {
    const file = await File.findById(req.params.id);
    if (!file) {
      return res.status(404).send({ error: 'File not found' });
    }

    // In a real app, delete from S3/FS here
    await file.deleteOne();
    
    // Update Project
    await Project.findByIdAndUpdate(file.projectId, { $pull: { files: file._id } });

    const log = new ActivityLog({
      projectId: file.projectId,
      user: req.user._id,
      action: 'File Deleted',
      details: { fileName: file.originalName }
    });
    await log.save();

    res.send({ message: 'File deleted' });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};
