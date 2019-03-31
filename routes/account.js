const passport = require("passport");
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
    "/api/accounts/:account_id",
    passport.authenticate("local"),
    readAccount
  );
  app.put(
    "/api/accounts/:account_id",
    passport.authenticate("local"),
    updateAccount
  );
  app.delete(
    "/api/accounts/:account_id",
    passport.authenticate("local"),
    deleteAccount
  );
};
