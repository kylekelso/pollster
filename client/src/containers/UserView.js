import React, { Component } from "react";
import { connect } from "react-redux";
import { Row, Col, Typography } from "antd";
import ResultsList from "./ResultsList";
import PageControl from "./PageControl";
import { doSearch, resetSearch } from "./../store/actions/search.actions";

class UserView extends Component {
  componentDidMount() {
    this.props.doSearch("polls", this.props.id, null, null, "creator");
  }

  componentWillUnmount() {
    this.props.resetSearch();
  }
  render() {
    return (
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
        <Col span={10}>
          <Typography.Title style={{ textAlign: "center" }}>
            User Statistics
          </Typography.Title>
          <Typography.Paragraph>Under Construction.</Typography.Paragraph>
        </Col>
        <Col span={10} offset={2}>
          <Typography.Title style={{ textAlign: "center" }}>
            {"Temp"}'s Polls
          </Typography.Title>
          <ResultsList />
          <PageControl searchField="creator" />
        </Col>
      </Row>
    );
  }
}

const mapStateToProps = state => ({});

export default connect(
  mapStateToProps,
  { doSearch, resetSearch }
)(UserView);
