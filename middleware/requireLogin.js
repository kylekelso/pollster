module.exports = (req, res, next) => {
  if (!req.account) {
    return res.status(401).send({ error: "Login required." });
  }
  next();
};
