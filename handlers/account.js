const db = require("../models");

exports.readAccounts = async function(req, res, next) {
  try {
    var page = Math.max(0, req.query.page - 1) || 0;
    var take = 10;

    let accounts = await db.Accounts.find({}, "username")
      .skip(page * take)
      .limit(take);
    return res.status(200).json(accounts);
  } catch (err) {
    return next({
      status: 400,
      message: err.message
    });
  }
};

exports.readAccount = async function(req, res, next) {
  try {
    let { id, username } = req.account;
    return res.status(200).json({ id, username });
  } catch (err) {
    return next({
      status: 400,
      message: err.message
    });
  }
};

exports.createAccount = async function(req, res, next) {
  try {
    let account = await db.Accounts.create(req.body);
    let { id, username } = account;
    return res.status(200).json({
      id,
      username
    });
  } catch (err) {
    return next({
      status: 400,
      message: err.message
    });
  }
};

exports.updateAccount = async function(req, res, next) {
  try {
    //do something
  } catch (err) {
    return next({
      status: 400,
      message: err.message
    });
  }
};

exports.deleteAccount = async function(req, res, next) {
  try {
    //delete account's polls or just show the user as deleted?
    db.Accounts.findOneAndDelete({ _id: req.account.id });
    return res.status(200);
  } catch (err) {
    return next({
      status: 400,
      message: err.message
    });
  }
};
