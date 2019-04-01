const passport = require("passport");
const requireLogin = require("../middleware/requireLogin");
const {
  readPolls,
  createPolls,
  readPoll,
  updatePoll,
  deletePoll
} = require("../handlers/poll");

module.exports = app => {
  app.get("/api/polls", readPolls);
  app.post("/api/polls", requireLogin, createPolls);
  app.get("/api/polls/:poll_id", readPoll);
  app.put("/api/polls/:poll_id", requireLogin, updatePoll);
  app.delete("/api/polls/:poll_id", requireLogin, deletePoll);
};
