import axios from "axios";
import * as actionTypes from "./actionTypes";

export const loginUser = (username, password) => async dispatch => {
  dispatch({ type: actionTypes.ATTEMPT_LOGIN_REQUEST });
  try {
    const res = await axios.post("/api/accounts/signin", {
      username,
      password
    });

    dispatch({ type: actionTypes.ATTEMPT_LOGIN_SUCCESS, payload: res.data });
  } catch (error) {
    dispatch({ type: actionTypes.ATTEMPT_LOGIN_FAILURE, error });
  }
};

export const toggleLoginModal = toggle => async dispatch => {
  dispatch({ type: actionTypes.TOGGLE_LOGIN_FORM, payload: toggle });
};
