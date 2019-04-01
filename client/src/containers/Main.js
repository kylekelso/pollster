import React, { Component } from "react";
import { Switch, Route } from "react-router-dom";

function homePage() {
  return <h2>Hello World!</h2>;
}

class Main extends Component {
  render() {
    return (
      <Switch>
        <Route exact path="/" component={homePage} />
      </Switch>
    );
  }
}

export default Main;
