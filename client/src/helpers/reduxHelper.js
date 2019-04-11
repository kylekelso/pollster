export default function reduxHelper(actionName, fn) {
  if (typeof actionName !== "string") {
    throw new Error("Expect actionName to be string");
  }
  const actionNameUpper = actionName.toUpperCase();
  const actionREQUEST = actionNameUpper + "_REQUEST";
  const actionSUCCESS = actionNameUpper + "_SUCCESS";
  const actionFAILURE = actionNameUpper + "_FAILURE";

  const INITIAL_STATE = {
    data: null,
    isLoading: false,
    error: null
  };

  const action = function(extra) {
    return dispatch => {
      dispatch({ type: actionREQUEST, payload: "" });

      try {
        fn()
          .then(res =>
            dispatch({
              type: actionSUCCESS,
              payload: { ...res.data, ...extra }
            })
          )
          .catch(error => dispatch({ type: actionFAILURE, payload: error }));
      } catch (error) {
        dispatch({
          type: actionFAILURE,
          error
        });
      }
    };
  };

  const reducer = (state, action, extra = {}) => {
    if (!state) {
      state = { ...INITIAL_STATE, ...extra };
    }
    switch (action.type) {
      case actionREQUEST:
        return { ...state, isLoading: true };
      case actionSUCCESS:
        return { ...state, isLoading: false, data: action.payload };
      case actionFAILURE:
        return { ...state, isLoading: false, error: action.error };
      default:
        return state;
    }
  };

  return {
    action,
    types: {
      request: actionREQUEST,
      success: actionSUCCESS,
      failure: actionFAILURE
    },
    reducer
  };
}
