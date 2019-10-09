module.exports = (req, res, next) => {
  if (!req.account) {
    return next({
      status: 401,
      error: { code: 1101, msg: "Login required." }
    });
  }
  next();
};
