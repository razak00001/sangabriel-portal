const mongoose = require('mongoose');

const sectionImageSchema = new mongoose.Schema({
  section: {
    type: String,
    required: true,
    enum: ['moments', 'conversation'], // Different sections that use grid images
  },
  i: {
    type: String,
    required: true,
  },
  x: {
    type: Number,
    required: true,
  },
  y: {
    type: Number,
    required: true,
  },
  w: {
    type: Number,
    required: true,
  },
  h: {
    type: Number,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  s3Key: {
    type: String,
    required: true, // Used to delete the file from S3 if needed
  }
}, { timestamps: true });

// We could add an index on section to speed up querying
sectionImageSchema.index({ section: 1 });

module.exports = mongoose.model('SectionImage', sectionImageSchema);
