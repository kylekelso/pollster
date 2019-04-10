const passport = require("passport");
const requireLogin = require("../middleware/requireLogin");
const {
  readAccounts,
  readAccount,
  createAccount,
  updateAccount,
  deleteAccount
} = require("../handlers/account");

module.exports = app => {
  app.get("/api/accounts", readAccounts);
  app.post("/api/accounts", createAccount);
  app.get(
    "/api/accounts/:username",
    passport.authenticate("local"),
    readAccount
  );
  app.put("/api/accounts/:username", requireLogin, updateAccount);
  app.delete("/api/accounts/:username", requireLogin, deleteAccount);
};
