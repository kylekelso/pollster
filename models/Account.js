const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const accountSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true
    },
    username: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: true
    },
    facebookId: String,
    googleId: String,
    twitterId: String
  },
  { timestamps: true, toJSON: { virtuals: true } }
);

accountSchema.pre("save", async function(next) {
  try {
    if (!this.isModified("password")) {
      return next();
    }
    let salt = await bcrypt.genSalt();
    let hashedPwd = await bcrypt.hash(this.password, salt);
    this.password = hashedPwd;
    return next();
  } catch (err) {
    return next(err);
  }
});

accountSchema.virtual("pollCount", {
  ref: "Poll",
  localField: "_id",
  foreignField: "creator",
  count: true
});

//for custom error messages rather than the default codes
accountSchema.post("save", function(err, doc, next) {
  if (err.name === "MongoError" && err.code === 11000) {
    var field = err.errmsg.split(".$")[1];
    field = field.split(" dup key")[0];
    field = field.substring(0, field.lastIndexOf("_"));
    next("An account with this " + field + " already exists.");
  } else if (err.name === "validatorError" && err.path === "username") {
    next("Username is required.");
  } else {
    next("Unknown database error has occured.");
  }
});

//public function - tests unecrypted password attempt with the encrypted one in database
accountSchema.methods.comparePassword = async function(candidatePwd, next) {
  try {
    let isMatch = await bcrypt.compare(candidatePwd, this.password);
    return isMatch;
  } catch (err) {
    return next(err);
  }
};

const Account = mongoose.model("Account", accountSchema);

module.exports = Account;
