import * as actionTypes from "../actions/actionTypes";

const INITIAL_STATE = {
  payload: [],
  searchText: "",
  searchType: "polls",
  isLoading: false,
  error: {}
};

export default function(state = INITIAL_STATE, action) {
  switch (action.type) {
    case actionTypes.TOGGLE_SEARCH_TYPE:
      if (state.searchType === "polls") {
        return { ...INITIAL_STATE, searchType: "users" };
      }
      return { ...INITIAL_STATE, searchType: "polls" };
    case actionTypes.FETCH_SEARCH_DATA:
      return { ...state, searchText: action.payload, isLoading: true };
    case actionTypes.FETCH_SEARCH_SUCCESS:
      return {
        ...state,
        payload: [...(action.payload.polls || action.payload.accounts)],
        isLoading: false
      };
    case actionTypes.FETCH_SEARCH_FAILURE:
      return { ...state, error: action.error, isLoading: false };
    default:
      return state;
  }
}
