import * as actionTypes from "../actions/actionTypes";
import reduxHelper from "./../../helpers/reduxHelper";

const user = reduxHelper(actionTypes.FETCH_USER);

const INITIAL_STATE = {
  id: null,
  username: null
};

export default function(state, action) {
  let newState = user.reducer(state, action, INITIAL_STATE);

  switch (action.type) {
    case actionTypes.RESET_VIEW:
      return INITIAL_STATE;
    case user.types.success:
      return { ...newState };
    case user.types.failure:
      return { ...newState };
    default:
      return newState;
  }
}
