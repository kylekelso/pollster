import React from "react";
import { Switch, Route } from "react-router-dom";
import PollForm from "../containers/PollForm";
//import PollForm from "./Pages/PollForm";
import Home from "./Pages/Home";
import View from "./Pages/View";

import NotFound from "./Pages/NotFound";

const Main = () => (
  <Switch>
    <Route exact path="/" component={Home} />
    <Route
      exact
      path="/createPoll"
      render={props => <PollForm {...props} type="create" />}
    />
    <Route
      exact
      path="/editPoll/:poll_id"
      render={props => <PollForm {...props} type="edit" />}
    />
    <Route exact path="/polls/:poll_id" component={View} />
    <Route exact path="/users/:username" component={View} />
    <Route path="*" exact={true} component={NotFound} />
  </Switch>
);

export default Main;
