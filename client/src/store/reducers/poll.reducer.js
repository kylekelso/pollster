import * as actionTypes from "../actions/actionTypes";
import reduxHelper from "./../../helpers/reduxHelper";

const poll = reduxHelper(actionTypes.FETCH_POLL);
const vote = reduxHelper(actionTypes.SUBMIT_VOTE);
const createPoll = reduxHelper(actionTypes.CREATE_POLL);

function convertToGenericObj(options) {
  var generic = options.map((obj, i) => {
    delete Object.assign(obj, { label: obj["option"] })["option"];
    delete Object.assign(obj, { value: obj["votes"] })["votes"];
    return obj;
  });
  return generic;
}

const INITIAL_STATE = {
  title: null,
  description: null,
  options: null,
  graphType: "pie"
};

export default function(state, action) {
  let newState = poll.reducer(state, action, INITIAL_STATE);
  newState = vote.reducer(newState, action);
  newState = createPoll.reducer(newState, action);

  switch (action.type) {
    case actionTypes.TOGGLE_GRAPH_MODE:
      return { ...state, graphType: action.payload };
    case actionTypes.RESET_VIEW:
      return INITIAL_STATE;
    case poll.types.failure:
      return { ...newState };
    case poll.types.success:
      return { ...newState, options: convertToGenericObj(newState.options) };
    case vote.types.success:
      return { ...newState, options: convertToGenericObj(newState.options) };
    case createPoll.types.failure:
      return { ...newState };
    case createPoll.types.success:
      return { ...newState, options: convertToGenericObj(newState.options) };
    default:
      return newState;
  }
}

// const INITIAL_STATE = {
//   pollData: null,
//   graphType: "pie",
//   isLoaded: false,
//   showVoteModal: false,
//   error: {}
// };

// export default function(state = INITIAL_STATE, action) {
//   var options;
//   const newState = reducer(state, action, {
//     title: null,
//     descriptions: null,
//     options: null
//   });
//   console.log(newState);

//   switch (action.type) {
//     case actionTypes.TOGGLE_GRAPH_MODE:
//       return { ...state, graphType: action.payload };
//     case actionTypes.FETCH_POLL_DATA:
//       return { ...INITIAL_STATE };
//     case types.request:
//       return { ...INITIAL_STATE };
//     case actionTypes.SUBMIT_VOTE_REQUEST:
//       return { ...state };
//     case types.success:
//       options = convertToGenericObj(action.payload.options);
//       return {
//         ...state,
//         pollData: { ...action.payload, options },
//         isLoaded: true
//       };
//     case actionTypes.SUBMIT_VOTE_SUCCESS:
//       options = convertToGenericObj(action.payload);
//       var totalVotes = state.pollData.totalVotes + 1;

//       return {
//         ...state,
//         pollData: { ...state.pollData, options, totalVotes }
//       };
//     case types.failure:
//       return { ...state, error: action.error, isLoaded: false };
//     case actionTypes.SUBMIT_VOTE_FAILURE:
//       return { ...state, error: action.error };
//     case actionTypes.TOGGLE_VOTE_FORM:
//       return { ...state, showVoteModal: !state.showVoteModal };
//     default:
//       return state;
//   }
// }
