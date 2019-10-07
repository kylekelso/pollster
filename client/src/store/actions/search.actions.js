import axios from "axios";
import * as actionTypes from "./actionTypes";
import reduxHelper from "./../../helpers/reduxHelper";

//takes in type of search
//1. resolves a pager value which signifies which direction the page is moving
//by seeing if prev or next value exists (Which should be an ID passed in)
//2. Then passes all other parameters to a request that is configured via type param
//3. Finally dispatches an action with the pager and the search value
export const doSearch = (type, search, prev, next) => async dispatch => {
  type = type === "users" ? "accounts" : type;
  let pager = next ? 1 : prev ? -1 : 0;

  const { action } = reduxHelper(actionTypes.FETCH_SEARCH, () =>
    axios.get(`/api/${type}`, {
      params: { search, prev, next }
    })
  );

  action({ pager, searchText: search })(dispatch);
};

export const setSearchType = type => async dispatch => {
  dispatch({ type: actionTypes.TOGGLE_SEARCH_TYPE, payload: type });
};
