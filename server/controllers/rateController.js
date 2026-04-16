const RateConfig = require('../models/RateConfig');
const asyncHandler = require('../utils/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Get current rates
// @route   GET /api/rates
// @access  Private
exports.getRates = asyncHandler(async (req, res, next) => {
  const rates = await RateConfig.findOne().sort({ createdAt: -1 });
  
  res.status(200).json({
    success: true,
    data: rates || { designRate: 0, installationRate: 0 }
  });
});

// @desc    Update rates
// @route   POST /api/rates
// @access  Private/Admin
exports.updateRates = asyncHandler(async (req, res, next) => {
  const { designRate, installationRate } = req.body;
  
  const rates = await RateConfig.findOneAndUpdate(
    {}, 
    { designRate, installationRate, updatedAt: Date.now() },
    { upsert: true, new: true }
  );

  res.status(200).json({
    success: true,
    data: rates
  });
});
