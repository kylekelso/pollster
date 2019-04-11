import * as actionTypes from "../actions/actionTypes";

const INITIAL_STATE = {
  loginModal: false,
  voteModal: false
};

export default function(state = INITIAL_STATE, action) {
  switch (action.type) {
    case actionTypes.TOGGLE_LOGIN_FORM:
      return { ...INITIAL_STATE, loginModal: action.payload };
    case actionTypes.TOGGLE_VOTE_FORM:
      return { ...INITIAL_STATE, voteModal: action.payload };
    default:
      return state;
  }
}
