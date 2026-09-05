/**
 * Async error handler middleware
 * Wraps async controller functions to catch erros and send consistent responses
 *
 * @param {Function} -> fn - The async controller function to wrap
 * @returns {Function} Express middleware function
 */

const asyncHandler = (fn) => {
  // Set displayName for better error tracking
  const handler = async (req, res, next) => {
    try {
      await fn(req, res, next);
    } catch (error) {
      const functionName = fn.displayName || fn.name || "anonymous";
      console.error(`Error in ${functionName}:`, error);
      res.status(error.status || 500).json({
        message: error.message || "Server error occurred",
        error:
          process.env.NODE_ENV === "production" ? undefined : error.message,
      });
    }
  };

  // Copy the original function's name to the handler
  handler.displayName = fn.displayName || fn.name;
  return handler;
};

/**
 * Create and throw an API error with status code
 * Useful for custom errors in controllers
 *
 * @param {string} -> message - Error message
 * @param {number} -> statusCode - HTTP status code
 * @returns {Error} ->  Error object with statusCode property
 */

const createError = (message, statusCode = 500) => {
  const error = new Error(message);
  error.status = statusCode;
  return error;
};

/**
 * Send a consistent API success response
 *
 * @param {Response} res - Express response object
 * @param {string} message - Success message
 * @param {number} statusCode - HTTP status code (default: 200)
 * @param {object} [data] - Optional data to return
 */
const sendResponse = (res, message, statusCode = 200, data = {}) => {
  res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

module.exports = {
  asyncHandler,
  createError,
  sendResponse,
};
