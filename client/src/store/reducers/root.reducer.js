import { combineReducers } from "redux";
import searchReducer from "./search.reducer";
import pagingReducer from "./paging.reducer";
import pollReducer from "./poll.reducer";
import userReducer from "./user.reducer";
import authReducer from "./auth.reducer";
import modalReducer from "./modal.reducer";

export default combineReducers({
  home: combineReducers({
    search: searchReducer,
    paging: pagingReducer
  }),
  view: combineReducers({
    poll: pollReducer,
    user: userReducer
  }),
  common: combineReducers({
    auth: authReducer,
    modal: modalReducer
  })
});
