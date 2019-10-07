import React, { Component } from "react";
import { connect } from "react-redux";
import {
  fetchPoll,
  toggleGraphType,
  toggleVoteModal
} from "../store/actions/view.actions";
import { Row, Col, Button, Spin, Divider, Typography, Tooltip } from "antd";
import VoteModal from "../containers/VoteModal";
import PieChart from "../components/D3/PieChart";
import BarChart from "../components/D3/BarChart";

const { Title } = Typography;

class PollView extends Component {
  async componentDidMount() {
    await this.props.fetchPoll(this.props.id);
  }

  renderContent() {
    let {
      graphType,
      title,
      description,
      options,
      totalVotes
    } = this.props.poll;
    var content = [
      <Col key={0} xs={{ span: 24 }}>
        <Typography>
          <Title> {title} </Title>
          <Divider>Description</Divider>
          <Title level={4}>{description}</Title>
        </Typography>
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
        <Button
          icon="form"
          size="large"
          onClick={() => this.props.toggleVoteModal(true)}
        >
          Vote
        </Button>
      </Col>
    );

    return content;
  }

  render() {
    let { isLoading, options } = this.props.poll;
    return (
      <div>
        <VoteModal />
        <Row
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
      </div>
    );
  }
}

const mapStateToProps = state => ({ poll: state.view.poll });

export default connect(
  mapStateToProps,
  { fetchPoll, toggleGraphType, toggleVoteModal }
)(PollView);
