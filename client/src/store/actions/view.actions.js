import axios from "axios";
import * as actionTypes from "./actionTypes";

export const fetchPollData = id => async dispatch => {
  dispatch({ type: actionTypes.FETCH_POLL_DATA });
  try {
    const res = await axios.get(`/api/polls/${id}`);

    dispatch({ type: actionTypes.FETCH_POLL_SUCCESS, payload: res.data });
  } catch (error) {
    dispatch({ type: actionTypes.FETCH_POLL_FAILURE, error });
  }
};

export const toggleGraphType = (type = "pie") => async dispatch => {
  dispatch({ type: actionTypes.TOGGLE_GRAPH_MODE, payload: type });
};
