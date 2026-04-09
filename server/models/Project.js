const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  clientName: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['DRAFT', 'ACTIVE', 'IN PROGRESS', 'PENDING REVIEW', 'REVISION REQUESTED', 'COMPLETE', 'BILLED', 'ARCHIVED'],
    default: 'DRAFT'
  },
  projectManager: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  specialInstructions: {
    type: String,
    trim: true
  },
  archivedAt: {
    type: Date
  },
  designer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  installer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  teamMembers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  timeline: {
    startDate: Date,
    endDate: Date
  },
  milestones: [{
    label: { type: String, required: true },
    completed: { type: Boolean, default: false },
    date: Date
  }],
  files: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'File'
  }],
  activityLogs: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ActivityLog'
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Project', projectSchema);
