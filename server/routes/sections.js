const express = require('express');
const router = express.Router();
const SectionImage = require('../models/SectionImage');
const { uploadImage, deleteFromS3 } = require('../utils/s3');
const { auth } = require('../middleware/auth');

// Get layout for a specific section
router.get('/:section', async (req, res) => {
  try {
    const images = await SectionImage.find({ section: req.params.section });
    res.json(images);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Upload image to S3 (used separately from saving the layout)
router.post('/upload', auth, uploadImage.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No image uploaded' });
  }
  res.json({
    imageUrl: req.file.location || `/uploads/${req.file.filename}`,
    s3Key: req.file.key || req.file.filename
  });
});

// Save/Update layout for a specific section
router.post('/:section/save', auth, async (req, res) => {
  try {
    const { section } = req.params;
    const { layout } = req.body; // array of SectionImage objects

    // We can do a simple approach: update existing by 'i', insert new ones.
    // Also find missing ones and delete them from DB (and optionally S3).
    const existingImages = await SectionImage.find({ section });
    const existingIds = existingImages.map(img => img.i);
    const newIds = layout.map(item => item.i);

    const idsToDelete = existingIds.filter(id => !newIds.includes(id));

    // Delete removed images from DB and S3
    for (const id of idsToDelete) {
      const imgToDelete = existingImages.find(img => img.i === id);
      if (imgToDelete && imgToDelete.s3Key) {
        await deleteFromS3(imgToDelete.s3Key);
      }
      await SectionImage.deleteOne({ _id: imgToDelete._id });
    }

    // Upsert the incoming layout array
    const operations = layout.map(item => ({
      updateOne: {
        filter: { section, i: item.i },
        update: { $set: { ...item, section } },
        upsert: true
      }
    }));

    if (operations.length > 0) {
      await SectionImage.bulkWrite(operations);
    }

    res.json({ message: 'Layout saved successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
