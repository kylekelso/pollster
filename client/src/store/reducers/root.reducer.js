import { combineReducers } from "redux";
import searchReducer from "./search.reducer";
import pagingReducer from "./paging.reducer";
import pollReducer from "./poll.reducer";

export default combineReducers({
  header: combineReducers({
    search: searchReducer,
    paging: pagingReducer
  }),
  view: combineReducers({
    poll: pollReducer
  })
});
