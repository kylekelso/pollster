const db = require("../models");
const {
  addPollIndex,
  updatePollIndex,
  deletePollIndex
} = require("../services/algolia");

exports.readPolls = async function(req, res, next) {
  try {
    //add conditon for our search text
    let conditions = [
      {
        title: { $regex: ".*" + (req.query.search || "") + ".*", $options: "i" }
      }
    ];
    //if cursor exists, add condition to go to next 'page' based on cursor
    req.query.cursor
      ? conditions.push({ _id: { $lt: req.query.cursor } })
      : null;

    let polls = await db.Polls.find(
      { $or: [...conditions] },
      "title description totalVotes"
    )
      .sort({
        _id: -1
      })
      .limit(5);

    let totalResults = await db.Polls.find(
      { $or: [...conditions] },
      "title description totalVotes"
    ).countDocuments();

    let cursor = "";
    if (polls.length > 0 && totalResults > 5) {
      cursor = polls[polls.length - 1]._id;
    }

    return res.status(200).json({ cursor, polls });
  } catch (error) {
    return next({
      status: 400,
      error
    });
  }
};

exports.createPolls = async function(req, res, next) {
  try {
    let poll = await db.Polls.create({
      creator: req.account.id,
      title: req.body.title,
      description: req.body.description,
      options: req.body.options
    });

    addPollIndex({ objectID: poll.id, title: poll.title });
    return res.status(200).json(poll);
  } catch (error) {
    return next({
      status: 400,
      error
    });
  }
};

exports.readPoll = async function(req, res, next) {
  try {
    let poll = await db.Polls.findOne({ _id: req.params.poll_id });
    return res.status(200).json(poll);
  } catch (error) {
    return next({
      status: 400,
      error
    });
  }
};
exports.updatePoll = async function(req, res, next) {
  try {
    let { title, description, options } = req.body;

    let poll = await db.Polls.findOneAndUpdate(
      { _id: req.params.poll_id },
      { title, description, options }
    );

    if (poll.title !== title) {
      updatePollIndex({ objectID: req.params.poll_id, title: poll.title });
    }
    return res.status(200).json({ title, description, options });
  } catch (error) {
    return next({
      status: 400,
      error
    });
  }
};

exports.deletePoll = async function(req, res, next) {
  try {
    await db.Polls.findOneAndDelete({
      creator: req.account.id,
      _id: req.params.poll_id
    });
    deletePollIndex(req.params.poll_id);
    return res.status(200).json({ message: "Poll deleted." });
  } catch (error) {
    return next({
      status: 400,
      error
    });
  }
};
