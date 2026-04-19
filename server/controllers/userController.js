const asyncHandler = require('../utils/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');
const User = require('../models/User');

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
exports.updateProfile = asyncHandler(async (req, res, next) => {
  const { name, email, phone } = req.body;
  
  const user = await User.findById(req.user._id);
  if (!user) return next(new ErrorResponse('User not found', 404));

  user.name = name || user.name;
  user.email = email || user.email;
  user.phone = phone || user.phone;

  await user.save();
  res.status(200).json({ success: true, data: user });
});

// @desc    Change password
// @route   PUT /api/users/change-password
// @access  Private
exports.changePassword = asyncHandler(async (req, res, next) => {
  const { oldPassword, newPassword } = req.body;
  
  const user = await User.findById(req.user._id);
  if (!user || !(await user.comparePassword(oldPassword))) {
    return next(new ErrorResponse('Invalid current password', 400));
  }

  user.password = newPassword;
  await user.save();
  
  res.status(200).json({ success: true, message: 'Password updated successfully' });
});
