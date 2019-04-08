import * as actionTypes from "../actions/actionTypes";

const INITIAL_STATE = {
  poll: null,
  graphType: "pie",
  isLoading: true,
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
        poll: { ...action.payload, options },
        isLoading: false
      };
    case actionTypes.FETCH_POLL_FAILURE:
      return { ...state, error: action.error, isLoading: false };
    default:
      return state;
  }
}
