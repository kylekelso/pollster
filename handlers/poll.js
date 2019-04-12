const db = require("../models");

exports.readPolls = async function(req, res, next) {
  try {
    let { search, prev, next } = req.query;
    //add conditon for our search text
    //search based on 'title' field not case sensitive
    let conditions = [
      {
        title: { $regex: ".*" + (search || "") + ".*", $options: "i" }
      }
    ];
    //two cursors that control navigation.
    //If next exists, go next page. Else, go to prev page.
    if (next) {
      conditions.push({ _id: { $lt: next } });
    } else if (prev) {
      conditions.push({ _id: { $gte: prev } });
    }

    let polls = await db.Polls.find(
      { $and: [...conditions] },
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

    let paging = {
      pages: Math.ceil(totalResults / 5),
      prev: "",
      next: ""
    };

    if (polls.length > 0 && totalResults > 5) {
      prev = polls[0]._id;
      next = polls[polls.length - 1]._id;
    }

    return res.status(200).json({ paging, polls });
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

exports.editPoll = async function(req, res, next) {
  try {
    let { title, description, options } = req.body;

    let poll = await db.Polls.findOneAndUpdate(
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

exports.votePoll = async function(req, res, next) {
  try {
    let poll = await db.Polls.findById(req.params.poll_id);
    poll.options.find(o => o.option === req.body.option).votes++;
    await poll.save();

    return res.status(200).json({ options: poll.options });
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
