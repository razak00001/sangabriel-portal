const File = require('../models/File');
const Project = require('../models/Project');
const ActivityLog = require('../models/ActivityLog');

exports.uploadFile = async (req, res) => {
  try {
    const { projectId, tag } = req.body;
    if (!req.file) {
      return res.status(400).send({ error: 'No file uploaded' });
    }

    const file = new File({
      originalName: req.file.originalname,
      fileName: req.file.filename,
      url: `/uploads/${req.file.filename}`, // Local URL for now
      key: req.file.filename,
      size: req.file.size,
      mimeType: req.file.mimetype,
      projectId,
      uploadedBy: req.user._id,
      tag: tag || 'Document'
    });

    await file.save();

    // Update Project and Log Activity
    await Project.findByIdAndUpdate(projectId, { $push: { files: file._id } });

    const log = new ActivityLog({
      projectId,
      user: req.user._id,
      action: 'File Uploaded',
      details: { fileName: file.originalName, tag: file.tag }
    });
    await log.save();

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
