import React, { Component } from "react";
import { connect } from "react-redux";
import { Row, Col, Spin, Typography, Statistic, Divider, Result } from "antd";
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
    let { username, ownVotes, pollVotes, error, isLoading } = this.props.user;
    let { totalResults } = this.props.search;

    if (error) {
      return (
        <Row
          type="flex"
          justify="center"
          align="middle"
          style={{
            background: "#fff",
            padding: 24,
            minHeight: "75vh",
            marginTop: "5vh",
            textAlign: "center"
          }}
        >
          <Result
            status="404"
            title="404"
            subTitle="Sorry, the page you visited does not exist."
          />
        </Row>
      );
    } else {
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
          {isLoading && <Spin />}
          {!isLoading && (
            <Col span={10}>
              <Typography.Title style={{ textAlign: "center" }}>
                {username}'s Statistics
              </Typography.Title>
              <Divider />
              <Row>
                <Col span={12}>
                  <Statistic title={`Created Polls`} value={totalResults} />
                </Col>
                <Col span={12}>
                  <Statistic
                    title={`Total Votes on Created Polls`}
                    value={pollVotes}
                  />
                </Col>
                <Col span={12}>
                  <Statistic title={`Vote Count`} value={ownVotes} />
                </Col>
              </Row>
            </Col>
          )}
          {!isLoading && (
            <Col span={10} offset={2}>
              <Typography.Title style={{ textAlign: "center" }}>
                {username}'s Polls
              </Typography.Title>
              <ResultsList />
              <PageControl searchField="creator" />
            </Col>
          )}
        </Row>
      );
    }
  }
}

const mapStateToProps = state => ({
  user: state.view.user,
  search: state.home.search
});

export default connect(
  mapStateToProps,
  { doSearch, resetSearch, fetchUser, resetView }
)(UserView);
