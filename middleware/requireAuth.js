const db = require("../models");

module.exports = async (req, res, next) => {
  try {
    if (!req.params.poll_id) {
      return next({
        status: 401,
        error: { code: 1101, msg: "Login required." }
      });
    }

    let poll = await db.Polls.findById(req.params.poll_id);

    if (poll.creator != req.account.id) {
      return next({
        status: 401,
        error: { code: 1102, msg: "Authorization required." }
      });
    }
    next();
  } catch (error) {
    return next({
      status: 400,
      error
    });
  }
};
