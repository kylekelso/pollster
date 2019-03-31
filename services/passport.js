const passport = require("passport"),
  localStrategy = require("passport-local").Strategy;

const db = require("../models");

module.exports = app => {
  passport.serializeUser((account, done) => {
    done(null, account.id);
  });

  passport.deserializeUser((id, done) => {
    db.Accounts.findById(id).then(acc => {
      done(null, acc);
    });
  });

  passport.use(
    new localStrategy(function(username, password, done) {
      db.Accounts.findOne({ username }, function(err, account) {
        if (err) {
          return done(err);
        }
        if (!account) {
          return done(null, false);
        }
        if (!account.comparePassword(password)) {
          return done(null, false);
        }
        return done(null, account);
      });
    })
  );

  app.use(passport.initialize({ userProperty: "account" }));
  app.use(passport.session());
};
