import axios from "axios";
import * as actionTypes from "./actionTypes";
import reduxHelper from "./../../helpers/reduxHelper";

export const createPoll = data => async dispatch => {
  const { action } = reduxHelper(actionTypes.CREATE_POLL, () =>
    axios.post("/api/polls", data)
  );

  action()(dispatch);
};

export const editPoll = (id, data) => async dispatch => {
  const { action } = reduxHelper(actionTypes.EDIT_POLL, () =>
    axios.put(`/api/polls/${id}/edit`, data)
  );

  action()(dispatch);
};

export const disableDatePicker = state => async dispatch => {
  dispatch({ type: actionTypes.TOGGLE_DATEPICKER, payload: state });
};
