const jwt = require('jsonwebtoken');
const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../utils/asyncHandler');

/**
 * auth
 * Middleware to protect routes and verify JWT token.
 * Populates req.user.
 */
const auth = asyncHandler(async (req, res, next) => {
  let token;

  if (req.header('Authorization') && req.header('Authorization').startsWith('Bearer')) {
    token = req.header('Authorization').replace('Bearer ', '');
  }

  if (!token) {
    return next(new ErrorResponse('Not authorized to access this route', 401));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ _id: decoded._id, status: 'Active' });

    if (!user) {
      return next(new ErrorResponse('User account not found or deactivated', 401));
    }

    req.user = user;
    req.token = token;
    next();
  } catch (err) {
    return next(new ErrorResponse('Not authorized to access this route', 401));
  }
});

/**
 * authorize
 * Middleware to restrict access based on user roles.
 * @param  {...any} roles 
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new ErrorResponse(`User role ${req.user.role} is not authorized to access this route`, 403));
    }
    next();
  };
};

module.exports = { auth, authorize };
