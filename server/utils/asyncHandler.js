/**
 * asyncHandler
 * Wraps async express routes to catch any errors and pass them to the next middleware.
 * Removes the need for repetitive try-catch blocks.
 */
const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

module.exports = asyncHandler;
