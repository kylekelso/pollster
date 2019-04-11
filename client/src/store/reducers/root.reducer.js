import { combineReducers } from "redux";
import searchReducer from "./search.reducer";
import pagingReducer from "./paging.reducer";
import pollReducer from "./poll.reducer";
import authReducer from "./auth.reducer";

export default combineReducers({
  home: combineReducers({
    search: searchReducer,
    paging: pagingReducer
  }),
  view: combineReducers({
    poll: pollReducer
  }),
  common: combineReducers({
    auth: authReducer
  })
});
