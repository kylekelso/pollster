import * as actionTypes from "../actions/actionTypes";

const INITIAL_STATE = {
  pollData: null,
  graphType: "pie",
  isLoaded: false,
  showVoteModal: false,
  error: {}
};

function convertToGenericObj(options) {
  var generic = options.map((obj, i) => {
    delete Object.assign(obj, { label: obj["option"] })["option"];
    delete Object.assign(obj, { value: obj["votes"] })["votes"];
    return obj;
  });
  return generic;
}

export default function(state = INITIAL_STATE, action) {
  var options;

  switch (action.type) {
    case actionTypes.TOGGLE_GRAPH_MODE:
      return { ...state, graphType: action.payload };
    case actionTypes.FETCH_POLL_DATA:
      return { ...INITIAL_STATE };
    case actionTypes.SUBMIT_VOTE_REQUEST:
      return { ...state };
    case actionTypes.FETCH_POLL_SUCCESS:
      options = convertToGenericObj(action.payload.options);

      return {
        ...state,
        pollData: { ...action.payload, options },
        isLoaded: true
      };
    case actionTypes.SUBMIT_VOTE_SUCCESS:
      options = convertToGenericObj(action.payload);
      var totalVotes = state.pollData.totalVotes + 1;

      return {
        ...state,
        pollData: { ...state.pollData, options, totalVotes }
      };
    case actionTypes.FETCH_POLL_FAILURE:
      return { ...state, error: action.error, isLoaded: false };
    case actionTypes.SUBMIT_VOTE_FAILURE:
      return { ...state, error: action.error };
    case actionTypes.TOGGLE_VOTE_FORM:
      return { ...state, showVoteModal: !state.showVoteModal };
    default:
      return state;
  }
}
