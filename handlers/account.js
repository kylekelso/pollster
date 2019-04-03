const db = require("../models");
const {
  addAccIndex,
  updateAccIndex,
  deleteAccIndex
} = require("../services/algolia");

exports.readAccounts = async function(req, res, next) {
  try {
    //add conditon for our search text
    let conditions = [
      {
        username: {
          $regex: ".*" + (req.query.search || "") + ".*",
          $options: "i"
        }
      }
    ];
    //if cursor exists, add condition to go to next 'page' based on cursor
    req.query.cursor
      ? conditions.push({ _id: { $lt: req.query.cursor } })
      : null;

    let accounts = await db.Accounts.find({ $or: [...conditions] }, "username")
      .sort({
        _id: -1
      })
      .limit(5)
      .populate("pollCount");

    let totalResults = await db.Accounts.find(
      { $or: [...conditions] },
      "username"
    ).countDocuments();

    let cursor = "";
    if (accounts.length > 0 && totalResults > 5) {
      cursor = accounts[accounts.length - 1]._id;
    }

    return res.status(200).json({ cursor, accounts });
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
    deleteAccIndex(req.account.id);
    return res.status(200).json({ message: "Account deleted." });
  } catch (error) {
    return next({
      status: 400,
      error
    });
  }
};
