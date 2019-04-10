import React, { Component } from "react";
import { connect } from "react-redux";
import {
  fetchPollData,
  toggleGraphType,
  toggleVoteModal
} from "../store/actions/view.actions";
import { Row, Col, Button, Spin, Divider, Typography, Tooltip } from "antd";
import VoteModal from "../containers/VoteModal";
import PieChart from "../components/D3/PieChart";
import BarChart from "../components/D3/BarChart";

const { Title, Paragraph } = Typography;

class PollView extends Component {
  async componentDidMount() {
    await this.props.fetchPollData(this.props.id);
  }

  renderContent() {
    let { pollData, graphType } = this.props.poll;
    var content = [
      <Col key={0} xs={{ span: 24 }}>
        <Typography>
          <Title> {pollData.title} </Title>
          <Divider>Description</Divider>
          <Title level={4}>{pollData.description}</Title>
        </Typography>
      </Col>
    ];

    content.push(
      <Col key={1} xs={{ span: 24 }} style={{ maxWidth: "600px" }}>
        {graphType === "pie" && (
          <PieChart width={400} height={200} data={pollData.options} />
        )}
        {graphType === "bar" && (
          <BarChart
            width={400}
            height={pollData.options.length * 15 + 65}
            data={pollData.options}
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
          onClick={() => this.props.toggleVoteModal()}
        >
          Vote
        </Button>
      </Col>
    );

    return content;
  }

  render() {
    let { isLoaded } = this.props.poll;
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
          {!isLoaded && <Spin />}
          {isLoaded && this.renderContent()}
        </Row>
      </div>
    );
  }
}

function mapStateToProps({ view }) {
  return { poll: view.poll };
}

export default connect(
  mapStateToProps,
  { fetchPollData, toggleGraphType, toggleVoteModal }
)(PollView);
