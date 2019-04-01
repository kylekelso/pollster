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

function optionLimits(val) {
  return val.length >= 2 && val.length <= 10;
}

const Poll = mongoose.model("Poll", pollSchema);

module.exports = Poll;
