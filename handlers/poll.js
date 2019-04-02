const db = require("../models");
const {
  addPollIndex,
  updatePollIndex,
  deletePollIndex
} = require("../services/algolia");

exports.readPolls = async function(req, res, next) {
  try {
    var page = Math.max(0, req.query.page - 1) || 0;
    var take = 10;

    let polls = await db.Polls.find(
      { title: { $regex: ".*" + (req.query.search || "") + ".*" } },
      "title description totalVotes"
    )
      .skip(page * take)
      .limit(take);

    let totalPages = await db.Polls.estimatedDocumentCount();
    totalPages = Math.ceil(totalPages / take);
    return res.status(200).json({ totalPages, polls });
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
