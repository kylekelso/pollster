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

export const toggleVoteModal = () => async dispatch => {
  dispatch({ type: actionTypes.TOGGLE_VOTE_FORM });
};

export const submitVote = (id, option) => async dispatch => {
  dispatch({ type: actionTypes.SUBMIT_VOTE_REQUEST });
  try {
    const res = await axios.put(`/api/polls/${id}/vote`, option);

    dispatch({ type: actionTypes.SUBMIT_VOTE_SUCCESS, payload: res.data });
  } catch (error) {
    dispatch({ type: actionTypes.SUBMIT_VOTE_FAILURE, error });
  }
};
