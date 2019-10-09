function errorHandler(errData, req, res, next) {
  let { error, status } = errData;
  if (!error.msg || !error.code) {
    error = { code: 1000, msg: "Unhandled error.", info: errData };
  }

  return res.status(status).json({ ...error });
}

module.exports = errorHandler;
