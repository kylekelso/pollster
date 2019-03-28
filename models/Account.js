const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const accountSchema = new mongoose.Schema({
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
  twitterId: String,
  polls: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Poll"
    }
  ]
});

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
