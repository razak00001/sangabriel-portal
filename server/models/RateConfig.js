const mongoose = require('mongoose');

const rateConfigSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    enum: ['hourly', 'project-based'],
    required: true
  },
  rate: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    default: 'USD'
  },
  version: {
    type: Number,
    default: 1
  },
  effectiveDate: {
    type: Date,
    default: Date.now
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('RateConfig', rateConfigSchema);
