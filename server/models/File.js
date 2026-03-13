const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
  originalName: {
    type: String,
    required: true
  },
  fileName: {
    type: String,
    required: true
  },
  url: {
    type: String, // Public URL from S3/Google Cloud
    required: true
  },
  key: {
    type: String, // S3 key for management/deletion
    required: true
  },
  size: {
    type: Number,
    required: true
  },
  mimeType: {
    type: String,
    required: true
  },
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  tag: {
    type: String, // e.g., 'Design', 'Installation', 'Document', 'Photo'
    enum: ['Design', 'Installation', 'Document', 'Photo', 'Thumbnail'],
    default: 'Document'
  },
  version: {
    type: Number,
    default: 1
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('File', fileSchema);
