const mongoose = require("mongoose");
const keys = require("../config/keys");

if (keys.ENVIRONMENT === "dev") {
  mongoose.set("debug", true);
}

mongoose.set("useFindAndModify", false);
mongoose.set("useCreateIndex", true);
mongoose.Promise = Promise;
mongoose.connect(keys.MONGO_URI, {
  keepAlive: true,
  useNewUrlParser: true
});

module.exports.Accounts = require("./Account");
module.exports.Polls = require("./Poll");
