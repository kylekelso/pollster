const mongoose = require("mongoose");

const pollSchema = new mongoose.Schema(
  {
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
    options: {
      type: [
        {
          option: String,
          votes: Number
        }
      ],
      required: true,
      validate: [
        optionLimits,
        "{PATH} must have at least two entries and a maximum of 10 entries."
      ]
    },
    totalVotes: {
      type: Number,
      default: 0
    },
    settings: {
      editable: {
        type: Boolean,
        default: true
      },
      endDate: {
        type: Date,
        default: null
      }
    }
  },
  { timestamps: true }
);

pollSchema.pre("save", async function(next) {
  if (!this.isModified("options")) {
    return next();
  }
  for (var i = 0; i < this.options.length; i++) {
    this.totalVotes += this.options[i].votes;
  }
  return next();
});

pollSchema.pre("findOneAndUpdate", async function(next) {
  var total = 0;
  for (var i = 0; i < this._update.options.length; i++) {
    total += this._update.options[i].votes;
  }
  this._update.$set.totalVotes = total;
  return next();
});

function optionLimits(val) {
  return val.length >= 2 && val.length <= 10;
}

const Poll = mongoose.model("Poll", pollSchema);

module.exports = Poll;
