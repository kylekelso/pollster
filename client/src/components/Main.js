import React from "react";
import { Switch, Route } from "react-router-dom";
import Home from "./Pages/Home";
import NotFound from "./Pages/NotFound";

const Main = () => (
  <Switch>
    <Route exact path="/" component={Home} />
    <Route path="*" exact={true} component={NotFound} />
  </Switch>
);

export default Main;
