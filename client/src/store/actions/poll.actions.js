import axios from "axios";
import * as actionTypes from "./actionTypes";
import reduxHelper from "./../../helpers/reduxHelper";

export const createPoll = data => async dispatch => {
  const { action } = reduxHelper(actionTypes.CREATE_POLL, () =>
    axios.post("/api/polls", data)
  );

  action()(dispatch);
};
