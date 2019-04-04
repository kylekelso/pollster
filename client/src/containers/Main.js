import React, { Component } from "react";
import { Switch, Route } from "react-router-dom";
import HomePage from "./HomePage";

const NotFound = () => <h4>Not Found</h4>;

class Main extends Component {
  render() {
    return (
      <Switch>
        <Route exact path="/" component={HomePage} />
        <Route path="*" exact={true} component={NotFound} />
      </Switch>
    );
  }
}

export default Main;
