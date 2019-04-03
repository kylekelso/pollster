import axios from "axios";
import * as actionTypes from "./actionTypes";

export const fetchSearchResults = (
  searchType,
  search = null,
  cursor = null
) => async dispatch => {
  dispatch({ type: actionTypes.FETCH_SEARCH_DATA });
  try {
    searchType = searchType === "users" ? "accounts" : searchType;
    const res = await axios.get(`/api/${searchType}`, {
      params: { search, cursor }
    });
    dispatch({ type: actionTypes.FETCH_SEARCH_SUCCESS, payload: res.data });
  } catch (error) {
    dispatch({ type: actionTypes.FETCH_SEARCH_FAILURE, error });
  }
};

export const toggleSearchType = () => async dispatch => {
  dispatch({ type: actionTypes.TOGGLE_SEARCH_TYPE });
};
