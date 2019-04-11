import * as actionTypes from "../actions/actionTypes";
import reduxHelper from "./../../helpers/reduxHelper";

const { types } = reduxHelper(actionTypes.FETCH_SEARCH);

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
    case types.success:
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
