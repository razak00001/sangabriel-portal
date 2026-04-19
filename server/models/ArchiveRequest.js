const mongoose = require('mongoose');

const archiveRequestSchema = new mongoose.Schema({
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  },
  requestedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['PENDING', 'RETRIEVING', 'COMPLETED', 'FAILED'],
    default: 'PENDING'
  },
  notes: {
    type: String,
    trim: true
  },
  retrievedAt: {
    type: Date
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('ArchiveRequest', archiveRequestSchema);
