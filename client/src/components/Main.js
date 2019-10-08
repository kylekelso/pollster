import React from "react";
import { Switch, Route } from "react-router-dom";
import CreatePoll from "./Pages/CreatePoll";
import Home from "./Pages/Home";
import View from "./Pages/View";
import NotFound from "./Pages/NotFound";

const Main = () => (
  <Switch>
    <Route exact path="/" component={Home} />
    <Route exact path="/createPoll" component={CreatePoll} />
    <Route exact path="/polls/:poll_id" component={View} />
    <Route exact path="/users/:username" component={View} />
    <Route path="*" exact={true} component={NotFound} />
  </Switch>
);

export default Main;
