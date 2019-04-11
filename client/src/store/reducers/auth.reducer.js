import * as actionTypes from "../actions/actionTypes";

const INITIAL_STATE = {
  attemptedLogin: false,
  isAuthenticated: false,
  showLogin: false,
  error: null
};

export default function(state = INITIAL_STATE, action) {
  switch (action.type) {
    case actionTypes.ATTEMPT_LOGIN_REQUEST:
      return {
        ...INITIAL_STATE,
        attemptedLogin: false,
        showLogin: state.showLogin
      };
    case actionTypes.ATTEMPT_LOGIN_SUCCESS:
      return {
        ...INITIAL_STATE,
        attemptedLogin: true,
        isAuthenticated: true,
        showLogin: state.showLogin
      };
    case actionTypes.ATTEMPT_LOGIN_FAILURE:
      return {
        ...INITIAL_STATE,
        attemptedLogin: true,
        showLogin: state.showLogin,
        error: action.error
      };
    case actionTypes.TOGGLE_LOGIN_FORM:
      return { ...state, showLogin: action.payload };
    default:
      return state;
  }
}
