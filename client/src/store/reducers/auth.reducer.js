import * as actionTypes from "../actions/actionTypes";
import reduxHelper from "./../../helpers/reduxHelper";

const login = reduxHelper(actionTypes.LOGIN);
const session = reduxHelper(actionTypes.SESSION);
const logout = reduxHelper(actionTypes.LOGOUT);
const join = reduxHelper(actionTypes.JOIN);

const INITIAL_STATE = {
  isAuthenticated: false
};

export default function(state, action) {
  let newState = login.reducer(state, action, INITIAL_STATE);
  newState = join.reducer(newState, action);
  newState = session.reducer(newState, action);
  newState = logout.reducer(newState, action);

  switch (action.type) {
    case login.types.request:
    case join.types.request:
    case login.types.failure:
    case join.types.failure:
    case session.types.failure:
    case logout.types.success:
      return {
        ...newState,
        isAuthenticated: false
      };
    case login.types.success:
    case join.types.success:
    case session.types.success:
      return {
        ...newState,
        isAuthenticated: true
      };
    default:
      return newState;
  }
}
