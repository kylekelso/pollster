const db = require("../models");

module.exports = async (req, res, next) => {
  try {
    if (!req.params.poll_id) {
      return next({
        status: 401,
        error: "Login required."
      });
    }

    let poll = await db.Polls.findById(req.params.poll_id);

    if (poll.creator != req.account.id) {
      return next({
        status: 401,
        error: "Authorization required."
      });
    }
    next();
  } catch (error) {
    return next({
      status: 401,
      error: "Resource not found."
    });
  }
};
