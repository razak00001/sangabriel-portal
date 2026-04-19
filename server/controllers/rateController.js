const asyncHandler = require('../utils/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');
const RateConfig = require('../models/RateConfig');

// @desc    Get current active rates
// @route   GET /api/rates
// @access  Private
exports.getRates = asyncHandler(async (req, res, next) => {
  const rates = await RateConfig.find({ isActive: true }).sort({ createdAt: -1 });
  
  res.status(200).json({
    success: true,
    data: rates
  });
});

const asyncHandler = require('../utils/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Update rates (Create new version)
// @route   POST /api/rates
// @access  Private/Admin
exports.updateRates = asyncHandler(async (req, res, next) => {
  const { id, title, rate, type } = req.body;
  
  if (id) {
    // Deactivate old version
    const oldRate = await RateConfig.findById(id);
    if (oldRate) {
      oldRate.isActive = false;
      await oldRate.save();

      // Create new version
      const newRate = await RateConfig.create({
        title: title || oldRate.title,
        rate: rate || oldRate.rate,
        type: type || oldRate.type,
        version: oldRate.version + 1,
        createdBy: req.user._id,
        isActive: true
      });

      return res.status(201).json({ success: true, data: newRate });
    }
  }

  // Create brand new entry if no ID
  const newRate = await RateConfig.create({
    title,
    rate,
    type,
    createdBy: req.user._id,
    isActive: true
  });

  res.status(201).json({
    success: true,
    data: newRate
  });
});
