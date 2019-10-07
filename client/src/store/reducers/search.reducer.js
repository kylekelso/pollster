import * as actionTypes from "../actions/actionTypes";
import reduxHelper from "./../../helpers/reduxHelper";

const { reducer } = reduxHelper(actionTypes.FETCH_SEARCH);

const INITIAL_STATE = {
  polls: null,
  accounts: null,
  searchType: "polls"
};

export default function(state, action) {
  const newState = reducer(state, action, INITIAL_STATE);

  switch (action.type) {
    case actionTypes.TOGGLE_SEARCH_TYPE:
      return {
        ...newState,
        polls: null,
        accounts: null,
        searchType: action.payload
      };
    case actionTypes.RESET_SEARCH:
      return INITIAL_STATE;
    default:
      return newState;
  }
}
