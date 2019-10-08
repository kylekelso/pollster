module.exports = (req, res, next) => {
  if (!req.account) {
    return next({
      status: 401,
      error: "Login required."
    });
  }
  next();
};
