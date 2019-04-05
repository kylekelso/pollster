import * as actionTypes from "../actions/actionTypes";

const INITIAL_STATE = {
  nextCursor: "",
  prevCursor: "",
  totalPages: null,
  page: 0
};

export default function(state = INITIAL_STATE, action) {
  switch (action.type) {
    case actionTypes.TOGGLE_SEARCH_TYPE:
      return INITIAL_STATE;
    case actionTypes.FETCH_SEARCH_SUCCESS:
      return {
        nextCursor: action.payload.paging.next,
        prevCursor: action.payload.paging.prev,
        totalPages: action.payload.paging.pages,
        page: state.page + action.payload.pager
      };
    default:
      return state;
  }
}
