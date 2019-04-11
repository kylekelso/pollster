import axios from "axios";
import * as actionTypes from "./actionTypes";
import reduxHelper from "./../../helpers/reduxHelper";

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
