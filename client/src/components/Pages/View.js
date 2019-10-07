import React from "react";
import { withRouter, Redirect } from "react-router-dom";
import PollView from "../../containers/PollView";
import UserView from "../../containers/UserView";

class View extends React.Component {
  render() {
    if (this.props.location.pathname.includes("polls")) {
      return <PollView id={this.props.match.params.poll_id} />;
    } else if (this.props.location.pathname.includes("users")) {
      return <UserView id={this.props.match.params.user_id} />;
    } else {
      return <Redirect to={this.props.location.pathname} />;
    }
  }
}

const routedView = withRouter(View);

export default routedView;
