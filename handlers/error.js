function errorHandler(errData, req, res, next) {
  return res.status(errData.status).json(errData.error);
}

module.exports = errorHandler;
