function errorHandler(errData, req, res, next) {
  return res.status(errData.status).json({ error: errData.error });
}

module.exports = errorHandler;
