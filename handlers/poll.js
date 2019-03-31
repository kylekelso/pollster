const db = require("../models");

exports.readPolls = async function(req, res, next) {
  try {
    var page = Math.max(0, req.query.page - 1) || 0;
    var take = 10;

    let polls = await db.Polls.find()
      .skip(page * take)
      .limit(take);

    return res.status(200).json(polls);
  } catch (err) {
    return next({
      status: 400,
      message: err.message
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
  } catch (err) {
    return next({
      status: 400,
      message: err.message
    });
  }
};

exports.readPoll = async function(req, res, next) {
  try {
    let poll = db.Polls.findOne({ _id: req.body.id });
    return res.status(200).json(poll);
  } catch (err) {
    return next({
      status: 400,
      message: err.message
    });
  }
};
exports.updatePoll = async function(req, res, next) {
  try {
    //do something
  } catch (err) {
    return next({
      status: 400,
      message: err.message
    });
  }
};

exports.deletePoll = async function(req, res, next) {
  try {
    db.Polls.findOne({ _id: req.body.id, creator: req.account.id });
    return res.status(200);
  } catch (err) {
    return next({
      status: 400,
      message: err.message
    });
  }
};
