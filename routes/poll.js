const passport = require("passport");
const {
  readPolls,
  createPolls,
  readPoll,
  updatePoll,
  deletePoll
} = require("../handlers/poll");

module.exports = app => {
  app.get("/polls", readPolls);
  app.post("/polls", passport.authenticate("local"), createPolls);
  app.get("/polls/:poll_id", readPoll);
  app.put("/polls/:poll_id", passport.authenticate("local"), updatePoll);
  app.delete("/polls/:poll_id", passport.authenticate("local"), deletePoll);
};
