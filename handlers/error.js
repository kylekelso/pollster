function errorHandler(error, req, res, next) {
  return res.status(error.status).json({
    error: {
      message: error.message || "Oops! Something went wrong."
    }
  });
}

module.exports = errorHandler;
