/**
 * ErrorResponse
 * Custom error class to handle HTTP status codes alongside error messages.
 */
class ErrorResponse extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;

    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = ErrorResponse;
