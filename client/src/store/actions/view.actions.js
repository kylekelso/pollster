import axios from "axios";
import * as actionTypes from "./actionTypes";
import reduxHelper from "./../../helpers/reduxHelper";

export const fetchPoll = id => async dispatch => {
  const { action } = reduxHelper(actionTypes.FETCH_POLL, () =>
    axios.get(`/api/polls/${id}`)
  );

  action()(dispatch);
};

export const submitVote = (id, option) => async dispatch => {
  const { action } = reduxHelper(actionTypes.SUBMIT_VOTE, () =>
    axios.put(`/api/polls/${id}/vote`, option)
  );

  action()(dispatch);
};

export const toggleGraphType = (type = "pie") => async dispatch => {
  dispatch({ type: actionTypes.TOGGLE_GRAPH_MODE, payload: type });
};

export const toggleVoteModal = toggle => async dispatch => {
  dispatch({ type: actionTypes.TOGGLE_VOTE_FORM, payload: toggle });
};
