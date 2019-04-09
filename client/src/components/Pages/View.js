import React from "react";
import PollView from "../../containers/PollView";

class View extends React.Component {
  render() {
    return <PollView id={this.props.match.params.poll_id} />;
  }
}

export default View;
