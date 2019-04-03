import * as actionTypes from "../actions/actionTypes";

const INITIAL_STATE = {
  payload: [],
  searchType: "polls",
  isLoading: false,
  error: {}
};

export default function(state = INITIAL_STATE, action) {
  switch (action.type) {
    case actionTypes.TOGGLE_SEARCH_TYPE:
      console.log(state.searchType);
      if (state.searchType === "polls") {
        return { ...state, searchType: "users" };
      }
      return { ...state, searchType: "polls" };
    case actionTypes.FETCH_SEARCH_DATA:
      return { ...state, isLoading: true };
    case actionTypes.FETCH_SEARCH_SUCCESS:
      return { ...state, payload: action.payload, isLoading: false };
    case actionTypes.FETCH_SEARCH_FAILURE:
      return { ...state, error: action.error, isLoading: false };
    case actionTypes.RESET_SEARCH_DATA:
      return { ...state, ...INITIAL_STATE };
    default:
      return state;
  }
}
