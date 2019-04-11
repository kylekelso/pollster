import * as actionTypes from "../actions/actionTypes";
import reduxHelper from "./../../helpers/reduxHelper";

const login = reduxHelper(actionTypes.LOGIN);
const session = reduxHelper(actionTypes.SESSION);
const logout = reduxHelper(actionTypes.LOGOUT);

export default function(state, action) {
  let newState = login.reducer(state, action, { isAuthenticated: false });
  newState = session.reducer(newState, action);
  newState = logout.reducer(newState, action);

  switch (action.type) {
    case login.types.request:
      return { ...newState, isAuthenticated: false };
    case login.types.failure:
      return { ...newState, isAuthenticated: false };
    case login.types.success:
      return {
        ...newState,
        isAuthenticated: true
      };
    default:
      return newState;
  }
}
