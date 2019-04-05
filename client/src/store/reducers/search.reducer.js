import * as actionTypes from "../actions/actionTypes";

const INITIAL_STATE = {
  nextCursor: "",
  prevCursor: "",
  payload: [],
  totalPages: null,
  page: 0,
  searchText: "",
  searchType: "polls",
  isLoading: false,
  error: {}
};

export default function(state = INITIAL_STATE, action) {
  switch (action.type) {
    case actionTypes.TOGGLE_SEARCH_TYPE:
      console.log(state.searchType);
      if (state.searchType === "polls") {
        return { ...INITIAL_STATE, searchType: "users" };
      }
      return { ...INITIAL_STATE, searchType: "polls" };
    case actionTypes.FETCH_SEARCH_DATA:
      return { ...state, searchText: action.payload, isLoading: true };
    case actionTypes.FETCH_SEARCH_SUCCESS:
      return {
        ...state,
        nextCursor: action.payload.paging.next,
        prevCursor: action.payload.paging.prev,
        totalPages: action.payload.paging.pages,
        page: state.page + action.payload.pager,
        payload: [...(action.payload.polls || action.payload.accounts)],
        isLoading: false
      };
    case actionTypes.FETCH_SEARCH_FAILURE:
      return { ...state, error: action.error, isLoading: false };
    case actionTypes.SET_SEARCH_TEXT:
      return { ...state, searchText: action.payload };
    default:
      return state;
  }
}
