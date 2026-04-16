const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { sendWelcomeEmail } = require('../utils/emailService');
const asyncHandler = require('../utils/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public (Demo)
exports.register = asyncHandler(async (req, res, next) => {
  const { name, email, password, role } = req.body;
  
  const user = new User({ name, email, password, role });
  await user.save();
  
  // Send Welcome Email (Non-critical, don't block response)
  sendWelcomeEmail(user).catch(err => console.error('Welcome email failed:', err));
  
  const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
  
  res.status(201).json({
    success: true,
    user,
    token
  });
});

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  
  if (!user || !(await user.comparePassword(password))) {
    return next(new ErrorResponse('Invalid login credentials', 401));
  }
  
  if (user.status !== 'Active') {
    return next(new ErrorResponse('Account is deactivated', 401));
  }

  const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
  
  res.status(200).json({
    success: true,
    user,
    token
  });
});

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = asyncHandler(async (req, res, next) => {
  res.status(200).json({
    success: true,
    user: req.user
  });
});
