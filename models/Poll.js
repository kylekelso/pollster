const mongoose = require("mongoose");

const pollSchema = new mongoose.Schema({
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Account",
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: String,
  options: [
    {
      option: String,
      votes: Number
    }
  ]
});

const Poll = mongoose.model("Poll", pollSchema);

module.exports = Poll;
