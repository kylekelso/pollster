import { combineReducers } from "redux";
import searchReducer from "./search.reducer";

export default combineReducers({
  header: combineReducers({
    search: searchReducer
  })
});
