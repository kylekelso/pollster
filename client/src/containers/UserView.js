import React, { Component } from "react";
import { connect } from "react-redux";
import { Row, Col, Typography } from "antd";
import ResultsList from "./ResultsList";
import PageControl from "./PageControl";
import { doSearch, resetSearch } from "./../store/actions/search.actions";
import { fetchUser, resetView } from "./../store/actions/view.actions";

class UserView extends Component {
  async componentDidMount() {
    await this.props.fetchUser(this.props.username);

    setTimeout(async () => {
      await this.props.doSearch(
        "polls",
        this.props.user.id,
        null,
        null,
        "creator"
      );
    }, 500);
  }

  componentWillUnmount() {
    this.props.resetSearch();
    this.props.resetView();
  }
  render() {
    let { username } = this.props.user;
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
            {username}'s Statistics
          </Typography.Title>
          <Typography.Paragraph>Under Construction.</Typography.Paragraph>
        </Col>
        <Col span={10} offset={2}>
          <Typography.Title style={{ textAlign: "center" }}>
            {username}'s Polls
          </Typography.Title>
          <ResultsList />
          <PageControl searchField="creator" />
        </Col>
      </Row>
    );
  }
}

const mapStateToProps = state => ({ user: state.view.user });

export default connect(
  mapStateToProps,
  { doSearch, resetSearch, fetchUser, resetView }
)(UserView);
