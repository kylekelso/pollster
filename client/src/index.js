import React from "react";
import ReactDOM from "react-dom";
import reduxThunk from "redux-thunk";
import { Provider } from "react-redux";
import { createStore, applyMiddleware, compose } from "redux";

import App from "./components/App";
import rootReducer from "./store/reducers/root.reducer";
import "antd/dist/antd.css";

var store;

if (process.env.NODE_ENV !== "production") {
  const composeEnhancers =
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  store = createStore(
    rootReducer,
    {},
    composeEnhancers(applyMiddleware(reduxThunk))
  );
} else {
  store = createStore(rootReducer, {}, applyMiddleware(reduxThunk));
}

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.querySelector("#root")
);
