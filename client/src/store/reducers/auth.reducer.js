import * as actionTypes from "../actions/actionTypes";
import reduxHelper from "./../../helpers/reduxHelper";

const { types, reducer } = reduxHelper(actionTypes.LOGIN);

export default function(state, action) {
  const newState = reducer(state, action, { isAuthenticated: false });

  switch (action.type) {
    case types.request:
      return { ...newState, isAuthenticated: false };
    case types.failure:
      return { ...newState, isAuthenticated: false };
    case types.success:
      return {
        ...newState,
        isAuthenticated: true
      };
    default:
      return newState;
  }
}
