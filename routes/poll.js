const requireLogin = require("../middleware/requireLogin");
const requireAuth = require("../middleware/requireAuth");
const {
  readPolls,
  createPolls,
  readPoll,
  editPoll,
  votePoll,
  deletePoll
} = require("../handlers/poll");

module.exports = app => {
  app.get("/api/polls", readPolls);
  app.post("/api/polls", requireLogin, createPolls);
  app.get("/api/polls/:poll_id", readPoll);
  app.put("/api/polls/:poll_id/edit", requireLogin, requireAuth, editPoll);
  app.put("/api/polls/:poll_id/vote", votePoll);
  app.delete("/api/polls/:poll_id", requireLogin, requireAuth, deletePoll);
};
