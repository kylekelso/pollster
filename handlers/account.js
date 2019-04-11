const db = require("../models");
const {
  addAccIndex,
  updateAccIndex,
  deleteAccIndex
} = require("../services/algolia");

exports.readAccounts = async function(req, res, next) {
  try {
    let { search, prev, next } = req.query;
    //add conditon for our search text
    //search based on 'username' field not case sensitive
    let conditions = [
      {
        username: {
          $regex: ".*" + (search || "") + ".*",
          $options: "i"
        }
      }
    ];
    //two cursors that control navigation.
    //If next exists, go next page. Else, go to prev page.
    if (next) {
      conditions.push({ _id: { $lt: next } });
    } else if (prev) {
      conditions.push({ _id: { $gte: prev } });
    }

    let accounts = await db.Accounts.find({ $and: [...conditions] }, "username")
      .sort({
        _id: -1
      })
      .limit(8)
      .populate("pollCount");

    let totalResults = await db.Accounts.find(
      { $or: [...conditions] },
      "username"
    ).countDocuments();

    let paging = {
      pages: Math.ceil(totalResults / 8),
      prev: "",
      next: ""
    };

    if (accounts.length > 0 && totalResults > 8) {
      paging.prev = accounts[0]._id;
      paging.next = accounts[accounts.length - 1]._id;
    }

    return res.status(200).json({ paging, accounts });
  } catch (error) {
    return next({
      status: 400,
      error
    });
  }
};

exports.readAccount = async function(req, res, next) {
  try {
    if (req.params.username) {
      let account = await db.Accounts.find({ username: req.params.username });
      if (account.length <= 0) {
        throw { message: "User not found." };
      }
      let { id, username } = account[0];

      return res.status(200).json({ id, username });
    } else if (req.account) {
      let { id, username } = req.account;
      return res.status(200).json({ isAuthenticated: true, id, username });
    } else {
      return res.status(200).json({ isAuthenticated: false });
    }
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
      { username: req.params.username },
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
    await db.Accounts.findOneAndDelete({ username: req.params.username });
    deleteAccIndex(req.account.id);
    return res.status(200).json({ message: "Account deleted." });
  } catch (error) {
    return next({
      status: 400,
      error
    });
  }
};

exports.logoutAccount = async function(req, res, next) {
  try {
    req.logout();
    return res.status(200).json({ isAuthenticated: false });
  } catch (error) {
    return next({
      status: 400,
      error
    });
  }
};
