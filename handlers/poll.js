const moment = require("moment"),
  db = require("../models");

exports.readPolls = async function(req, res, next) {
  try {
    let { search, prev, next, field } = req.query;

    //add conditon for our search text
    //search based on 'title' field not case sensitive
    let conditions = [
      field == "title"
        ? {
            title: { $regex: ".*" + (search || "") + ".*", $options: "i" }
          }
        : {},
      field == "creator"
        ? {
            creator: search
          }
        : {}
    ];
    //two cursors that control navigation.
    //If next exists, go next page. Else, go to prev page.
    let polls = [];

    if (next) {
      conditions.push({ _id: { $lt: next } });
    }

    if (prev) {
      conditions.push({ _id: { $gt: prev } });

      polls = await db.Polls.find(
        { $and: [...conditions] },
        "title description totalVotes"
      )
        .sort({
          _id: 1
        })
        .limit(5);
      polls = polls.reverse();
    } else {
      polls = await db.Polls.find(
        { $and: [...conditions] },
        "title description totalVotes"
      )
        .sort({
          _id: -1
        })
        .limit(5);
    }

    let totalResults = 1;

    if (field == "title") {
      totalResults = await db.Polls.find(
        { $or: [...conditions] },
        "title description totalVotes"
      ).countDocuments();
    } else {
      totalResults = await db.Polls.find(
        { $and: [...conditions] },
        "title description totalVotes"
      ).countDocuments();
    }

    let paging = {
      pages: Math.ceil(totalResults / 5),
      prev: "",
      next: ""
    };

    if (polls.length > 0 && totalResults > 5) {
      paging.prev = polls[0]._id;
      paging.next = polls[polls.length - 1]._id;
    }

    return res.status(200).json({ paging, polls, totalResults });
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
      ...req.body
    });
    return res.status(201).json(poll);
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

    if (poll.length <= 0) {
      return next({
        status: 404,
        error: {
          code: 1201,
          msg: "The poll you are looking for does not exist."
        }
      });
    }

    return res.status(200).json(poll);
  } catch (error) {
    return next({
      status: 400,
      error
    });
  }
};

exports.editPoll = async function(req, res, next) {
  try {
    let { title, description, settings } = req.body;

    let poll = await db.Polls.findById(req.params.poll_id);
    let { editable } = poll.settings;

    if (editable && req.account.id == poll.creator) {
      poll.title = title;
      poll.description = description;
      poll.settings = settings;
      await poll.save();
    } else if (req.account.id != poll.creator) {
      return next({
        status: 401,
        error: { code: 1102, msg: "Authorization required." }
      });
    } else {
      return next({
        status: 400,
        error: { code: 1105, msg: "Poll settings do not permit edits." }
      });
    }

    return res.status(200).json(poll);
  } catch (error) {
    return next({
      status: 400,
      error
    });
  }
};

exports.votePoll = async function(req, res, next) {
  try {
    let poll = await db.Polls.findById(req.params.poll_id);
    let { loginToVote, endDate } = poll.settings;

    let pollExpired =
      endDate != null ? moment(endDate) <= moment().startOf("day") : false;

    if (loginToVote && !req.account) {
      return next({
        status: 401,
        error: { code: 1101, msg: "Login required." }
      });
    } else if (pollExpired) {
      return next({
        status: 400,
        error: { code: 1104, msg: "Poll has expired." }
      });
    }
    poll.options.find(o => o.option === req.body.option).votes++;
    await poll.save();

    let pollUser = await db.Accounts.findById(poll.creator);
    pollUser.pollVotes++;
    await pollUser.save();

    if (req.account) {
      let votingUser = await db.Accounts.findById(req.account._id);
      votingUser.ownVotes++;
      await votingUser.save();
    }

    return res.status(200).json(poll);
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
    return res.status(204);
  } catch (error) {
    return next({
      status: 400,
      error
    });
  }
};
