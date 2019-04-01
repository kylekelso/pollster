const db = require("../models");
const {
  addAccIndex,
  updateAccIndex,
  deleteAccIndex
} = require("../services/algolia");

exports.readAccounts = async function(req, res, next) {
  try {
    var page = Math.max(0, req.query.page - 1) || 0;
    var take = 10;
    let accounts = await db.Accounts.find({}, "username")
      .skip(page * take)
      .limit(take);

    let totalPages = await db.Accounts.estimatedDocumentCount();
    totalPages = Math.ceil(totalPages / take);
    return res.status(200).json({ totalPages, accounts });
  } catch (error) {
    return next({
      status: 400,
      error
    });
  }
};

exports.readAccount = async function(req, res, next) {
  try {
    let { id, username } = req.account;
    return res.status(200).json({ id, username });
  } catch (error) {
    return next({
      status: 400,
      error
    });
  }
};

exports.createAccount = async function(req, res, next) {
  try {
    let account = await db.Accounts.create(req.body);
    let { id, username } = account;
    addAccIndex({ objectID: id, username });
    return res.status(200).json({
      id,
      username
    });
  } catch (error) {
    return next({
      status: 400,
      error
    });
  }
};

exports.updateAccount = async function(req, res, next) {
  try {
    let updatedAccount = await db.Accounts.findOneAndUpdate(
      { _id: req.account.id },
      { $set: { username: req.body.newUsername } },
      { new: true }
    );
    let { id, username } = updatedAccount;
    updateAccIndex({ objectID: id, username });
    return res.status(200).json({
      id,
      username
    });
  } catch (error) {
    return next({
      status: 400,
      error
    });
  }
};

exports.deleteAccount = async function(req, res, next) {
  try {
    //delete account's polls or just show the user as deleted?
    await db.Accounts.findOneAndDelete({ _id: req.account.id });
    deleteAccIndex(id);
    return res.status(200).json({ message: "Account deleted." });
  } catch (error) {
    return next({
      status: 400,
      error
    });
  }
};
