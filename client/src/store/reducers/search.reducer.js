import * as actionTypes from "../actions/actionTypes";

const INITIAL_STATE = {
  cursor: "",
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
        return { ...state, cursor: "", payload: [], searchType: "users" };
      }
      return { ...state, cursor: "", payload: [], searchType: "polls" };
    case actionTypes.FETCH_SEARCH_DATA:
      return { ...state, isLoading: true };
    case actionTypes.FETCH_SEARCH_SUCCESS:
      return {
        ...state,
        cursor: action.payload.cursor,
        payload: [...(action.payload.polls || action.payload.accounts)],
        isLoading: false
      };
    case actionTypes.FETCH_SEARCH_FAILURE:
      return { ...state, error: action.error, isLoading: false };
    case actionTypes.RESET_SEARCH_DATA:
      return { ...state, ...INITIAL_STATE };
    default:
      return state;
  }
}
