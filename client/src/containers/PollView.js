import React, { Component } from "react";
import moment from "moment";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import {
  Col,
  Row,
  Tag,
  Spin,
  Button,
  Divider,
  Popover,
  Tooltip,
  message,
  Typography
} from "antd";
import {
  fetchPoll,
  resetView,
  toggleVoteModal,
  toggleGraphType
} from "../store/actions/view.actions";
import VoteModal from "../containers/VoteModal";
import PieChart from "../components/D3/PieChart";
import BarChart from "../components/D3/BarChart";
import { renderErrorPage } from "../helpers/handleErrors";

class PollView extends Component {
  async componentDidMount() {
    await this.props.fetchPoll(this.props.id);
  }

  componentWillUnmount() {
    this.props.resetView();
  }

  componentDidUpdate() {
    let { error } = this.props.poll;
    if (error && error.code === 1101) {
      message.warn(error.msg);
    }
  }

  renderContent() {
    let {
      graphType,
      title,
      description,
      options,
      totalVotes,
      settings,
      creator,
      _id
    } = this.props.poll;

    let disableVote = settings.loginToVote && !this.props.auth.isAuthenticated;
    let canEdit = settings.editable && this.props.auth.id === creator;

    var content = [
      <Col key={0} xs={{ span: 24 }}>
        <Typography.Title>{title}</Typography.Title>
        <Divider>{description}</Divider>
        {settings.loginToVote && (
          <Popover content="Only those who are logged into an account can vote.">
            <Tag color="#40a9ff">Private Voting</Tag>
          </Popover>
        )}
        {settings.editable && (
          <Popover content="The author can edit the title, description and settings at any time.">
            <Tag color="#40a9ff">Editing</Tag>
          </Popover>
        )}
        {settings.endDate && (
          <Popover content="Time until voting is closed.">
            <Tag color="#40a9ff">{moment(settings.endDate).fromNow()}</Tag>
          </Popover>
        )}
      </Col>
    ];

    content.push(
      <Col key={1} xs={{ span: 24 }} style={{ maxWidth: "600px" }}>
        {graphType === "pie" && (
          <PieChart
            width={400}
            height={200}
            data={options}
            total={totalVotes}
          />
        )}
        {graphType === "bar" && (
          <BarChart
            width={400}
            height={options.length * 15 + 65}
            data={options}
            total={totalVotes}
          />
        )}
      </Col>
    );

    content.push(
      <Col key={2} xs={{ span: 24 }}>
        <Tooltip title="Show Pie Chart">
          <Button
            shape="circle"
            icon="pie-chart"
            size="large"
            style={{ marginRight: "15px" }}
            onClick={() => this.props.toggleGraphType("pie")}
          />
        </Tooltip>
        <Tooltip title="Show Bar Chart">
          <Button
            shape="circle"
            icon="bar-chart"
            size="large"
            style={{ marginRight: "15px" }}
            onClick={() => this.props.toggleGraphType("bar")}
          />
        </Tooltip>
        <Tooltip title={disableVote ? "Requires Login!" : "Vote!"}>
          <Button
            shape="circle"
            icon="check"
            size="large"
            disabled={disableVote}
            style={{ marginRight: "15px" }}
            onClick={() => this.props.toggleVoteModal(true)}
          />
        </Tooltip>
        {canEdit && (
          <Tooltip title={"Edit Poll"}>
            <Button
              icon="form"
              size="large"
              style={{ marginRight: "15px" }}
              onClick={() => this.props.history.push(`/editPoll/${_id}`)}
            />
          </Tooltip>
        )}
      </Col>
    );

    return content;
  }

  render() {
    let { isLoading, options, error } = this.props.poll;
    if (error && error.code !== 1101) {
      return renderErrorPage(error.code, error.msg);
    } else {
      return [
        <VoteModal key={0} />,
        <Row
          key={1}
          type="flex"
          justify="center"
          align="top"
          style={{
            background: "#fff",
            padding: 24,
            minHeight: "75vh",
            marginTop: "5vh",
            textAlign: "center"
          }}
        >
          {isLoading && <Spin />}
          {options && this.renderContent()}
        </Row>
      ];
    }
  }
}

const mapStateToProps = state => ({
  auth: state.common.auth,
  poll: state.view.poll
});

const routedView = withRouter(PollView);

export default connect(
  mapStateToProps,
  { fetchPoll, resetView, toggleGraphType, toggleVoteModal }
)(routedView);
