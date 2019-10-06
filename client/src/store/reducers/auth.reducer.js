import * as actionTypes from "../actions/actionTypes";
import reduxHelper from "./../../helpers/reduxHelper";

const login = reduxHelper(actionTypes.LOGIN);
const session = reduxHelper(actionTypes.SESSION);
const logout = reduxHelper(actionTypes.LOGOUT);
const join = reduxHelper(actionTypes.JOIN);

export default function(state, action) {
  let newState = login.reducer(state, action, { isAuthenticated: false });
  newState = join.reducer(newState, action);
  newState = session.reducer(newState, action);
  newState = logout.reducer(newState, action);

  switch (action.type) {
    case login.types.request:
    case join.types.request:
      return { ...newState, isAuthenticated: false, error: null };
    case login.types.failure:
    case join.types.failure:
      return {
        ...newState,
        isAuthenticated: false,
        error: action.payload.response.data
      };
    case login.types.success:
    case join.types.success:
      return {
        ...newState,
        isAuthenticated: true,
        error: null
      };
    default:
      return newState;
  }
}
