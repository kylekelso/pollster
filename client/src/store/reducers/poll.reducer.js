import * as actionTypes from "../actions/actionTypes";
import reduxHelper from "./../../helpers/reduxHelper";

const poll = reduxHelper(actionTypes.FETCH_POLL);
const vote = reduxHelper(actionTypes.SUBMIT_VOTE);
const createPoll = reduxHelper(actionTypes.CREATE_POLL);
const editPoll = reduxHelper(actionTypes.EDIT_POLL);

function convertToGenericObj(options) {
  var generic = options.map((obj, i) => {
    delete Object.assign(obj, { label: obj["option"] })["option"];
    delete Object.assign(obj, { value: obj["votes"] })["votes"];
    return obj;
  });
  return generic;
}

const INITIAL_STATE = {
  creator: null,
  title: null,
  description: null,
  options: null,
  settings: { editable: null, loginToVote: null, endDate: null },
  isLoading: false,
  error: null,
  graphType: "pie",
  disableDate: null,
  _id: null
};

export default function(state, action) {
  let newState = poll.reducer(state, action, INITIAL_STATE);
  newState = vote.reducer(newState, action);
  newState = createPoll.reducer(newState, action);
  newState = editPoll.reducer(newState, action);

  switch (action.type) {
    case actionTypes.TOGGLE_GRAPH_MODE:
      return { ...state, graphType: action.payload };
    case actionTypes.TOGGLE_DATEPICKER:
      return { ...state, disableDate: action.payload };
    case actionTypes.RESET_VIEW:
      return INITIAL_STATE;
    case poll.types.success:
      return { ...newState, options: convertToGenericObj(newState.options) };
    case vote.types.success:
      return { ...newState, options: convertToGenericObj(newState.options) };
    case createPoll.types.success:
    case editPoll.types.success:
      return {
        ...newState,
        isLoading: true,
        options: convertToGenericObj(newState.options)
      };
    default:
      return newState;
  }
}
