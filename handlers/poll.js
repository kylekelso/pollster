const db = require("../models");

exports.readPolls = async function(req, res, next) {
  try {
    var page = Math.max(0, req.query.page - 1) || 0;
    var take = 10;

    let polls = await db.Polls.find()
      .skip(page * take)
      .limit(take);

    return res.status(200).json(polls);
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

    let account = await db.Accounts.findOne({ _id: req.account.id });
    account.polls.push(poll.id);
    await account.save();

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

    await db.Polls.findOneAndUpdate(
      { _id: req.params.poll_id },
      { title, description, options }
    );

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
    return res.status(200).json({ message: "Poll deleted." });
  } catch (error) {
    return next({
      status: 400,
      error
    });
  }
};
