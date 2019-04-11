const passport = require("passport");
const requireLogin = require("../middleware/requireLogin");
const {
  readAccounts,
  readAccount,
  updateAccount,
  deleteAccount,
  createAccount,
  logoutAccount
} = require("../handlers/account");

module.exports = app => {
  app.get("/api/accounts", readAccounts);
  app.get("/api/accounts/:username([0-9a-zA-Z]{7,})", readAccount);
  app.put(
    "/api/accounts/:username([0-9a-zA-Z]{7,})",
    requireLogin,
    updateAccount
  );
  app.delete(
    "/api/accounts/:username([0-9a-zA-Z]{7,})",
    requireLogin,
    deleteAccount
  );

  app.post("/api/accounts/signin", passport.authenticate("local"), readAccount);
  app.post("/api/accounts/signup", createAccount);
  app.delete("/api/accounts/logout", requireLogin, logoutAccount);
};
