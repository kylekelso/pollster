import axios from "axios";
import * as actionTypes from "./actionTypes";
import reduxHelper from "./../../helpers/reduxHelper";

export const loginUser = (username, password) => async dispatch => {
  const { action } = reduxHelper(actionTypes.LOGIN, () =>
    axios.post("/api/accounts/signin", { username, password })
  );

  action()(dispatch);
};

export const logoutUser = () => async dispatch => {
  const { action } = reduxHelper(actionTypes.LOGOUT, () =>
    axios.delete("/api/accounts/logout")
  );

  action()(dispatch);
};

export const checkSession = () => async dispatch => {
  const { action } = reduxHelper(actionTypes.SESSION, () =>
    axios.get("/api/accounts/access")
  );

  action()(dispatch);
};

export const toggleLoginModal = toggle => async dispatch => {
  dispatch({ type: actionTypes.TOGGLE_LOGIN_FORM, payload: toggle });
};
