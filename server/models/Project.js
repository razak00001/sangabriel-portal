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
    enum: ['Created', 'Design Phase', 'Client Review', 'Approved', 'Installation Phase', 'Completed'],
    default: 'Created'
  },
  coordinator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
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
