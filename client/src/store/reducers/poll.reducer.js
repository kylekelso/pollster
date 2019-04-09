import * as actionTypes from "../actions/actionTypes";

const INITIAL_STATE = {
  pollData: null,
  graphType: "pie",
  isLoaded: false,
  showVoteModal: false,
  error: {}
};

export default function(state = INITIAL_STATE, action) {
  switch (action.type) {
    case actionTypes.TOGGLE_GRAPH_MODE:
      return { ...state, graphType: action.payload };
    case actionTypes.FETCH_POLL_DATA:
      return { ...INITIAL_STATE };
    case actionTypes.FETCH_POLL_SUCCESS:
      var options = action.payload.options.map((obj, i) => {
        delete Object.assign(obj, { label: obj["option"] })["option"];
        delete Object.assign(obj, { value: obj["votes"] })["votes"];
        return obj;
      });

      return {
        ...state,
        pollData: { ...action.payload, options },
        isLoaded: true
      };
    case actionTypes.FETCH_POLL_FAILURE:
      return { ...state, error: action.error, isLoading: false };
    case actionTypes.TOGGLE_VOTE_FORM:
      return { ...state, showVoteModal: !state.showVoteModal };
    default:
      return state;
  }
}
