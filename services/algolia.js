const algolia = require("algoliasearch");
const keys = require("../config/keys");

var client = algolia(keys.ALOGIA_APP_ID, keys.ALOGIA_ADMIN);

var AccIndex = client.initIndex("dev_Pollster_Accs");
var PollIndex = client.initIndex("dev_Pollster_Polls");

exports.addAccIndex = object => AccIndex.addObject(object);
exports.addPollIndex = object => PollIndex.addObject(object);

exports.updateAccIndex = updatedAcc => AccIndex.saveObject(updatedAcc);
exports.updatePollIndex = updatedPoll => PollIndex.saveObject(updatedPoll);

exports.deleteAccIndex = accId => AccIndex.deleteObject(accId);
exports.deletePollIndex = pollId => PollIndex.deleteObject(pollId);
const algolia = require("algoliasearch");
const keys = require("../config/keys");

if (process.env.NODE_ENV !== "production") {
  exports.addAccIndex = object => {
    return object;
  };
  exports.addPollIndex = object => {
    return object;
  };

  exports.updateAccIndex = object => {
    return object;
  };
  exports.updatePollIndex = object => {
    return object;
  };

  exports.deleteAccIndex = object => {
    return object;
  };
  exports.deletePollIndex = object => {
    return object;
  };
} else {
  var client = algolia(keys.ALOGIA_APP_ID, keys.ALOGIA_ADMIN);

  var AccIndex = client.initIndex("dev_Pollster_Accs");
  var PollIndex = client.initIndex("dev_Pollster_Polls");

  exports.addAccIndex = object => AccIndex.addObject(object);
  exports.addPollIndex = object => PollIndex.addObject(object);

  exports.updateAccIndex = updatedAcc => AccIndex.saveObject(updatedAcc);
  exports.updatePollIndex = updatedPoll => PollIndex.saveObject(updatedPoll);

  exports.deleteAccIndex = accId => AccIndex.deleteObject(accId);
  exports.deletePollIndex = pollId => PollIndex.deleteObject(pollId);
}
