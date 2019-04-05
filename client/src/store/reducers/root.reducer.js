import { combineReducers } from "redux";
import searchReducer from "./search.reducer";
import pagingReducer from "./paging.reducer";

export default combineReducers({
  header: combineReducers({
    search: searchReducer,
    paging: pagingReducer
  })
});
