import React, { Component } from "react";
import { BrowserRouter } from "react-router-dom";
import Main from "./Main";
import "bootstrap/dist/css/bootstrap.min.css";

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <div className="onboarding">
          <Main />
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
