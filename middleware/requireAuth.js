const db = require("../models");

module.exports = async (req, res, next) => {
  try {
    if (!req.params.poll_id) {
      return res.status(401).send({ error: "Login required." });
    }

    let poll = await db.Polls.findById(req.params.poll_id);

    if (poll.creator != req.account.id) {
      return res.status(401).send({ error: "Auth required." });
    }
    next();
  } catch (error) {
    return res.status(400).send({ error: "Resource not found." });
  }
};
