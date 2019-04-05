import axios from "axios";
import * as actionTypes from "./actionTypes";

export const fetchSearchResults = (
  searchType,
  search = null,
  prev = null,
  next = null
) => async dispatch => {
  dispatch({ type: actionTypes.FETCH_SEARCH_DATA, payload: search });
  try {
    searchType = searchType === "users" ? "accounts" : searchType;

    const res = await axios.get(`/api/${searchType}`, {
      params: { search, prev, next }
    });

    let pager = next ? 1 : prev ? -1 : 0;

    dispatch({
      type: actionTypes.FETCH_SEARCH_SUCCESS,
      payload: { ...res.data, pager }
    });
  } catch (error) {
    dispatch({ type: actionTypes.FETCH_SEARCH_FAILURE, error });
  }
};

export const toggleSearchType = () => async dispatch => {
  dispatch({ type: actionTypes.TOGGLE_SEARCH_TYPE });
};
