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

  app.get("/api/accounts/access", readAccount);
  app.post("/api/accounts/signin", function(req, res, next) {
    passport.authenticate("local", function(err, user, info) {
      if (err) {
        return next({
          status: 400,
          error: "Unknown error has occured."
        });
      }
      if (!user) {
        return next({
          status: 401,
          error: "Incorrect credentials."
        });
      }
      req.logIn(user, function(err) {
        if (err) {
          return;
        }
        readAccount(req, res, next);
      });
    })(req, res, next);
  });
  //app.post("/api/accounts/signin", passport.authenticate("local"), readAccount);
  app.post("/api/accounts/signup", createAccount);
  app.delete("/api/accounts/logout", requireLogin, logoutAccount);
};
