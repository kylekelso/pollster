import React, { Component } from "react";
import { Row, Col, Typography } from "antd";
import { connect } from "react-redux";
import SearchBar from "../components/SearchBar";
import Paginator from "../components/Paginator";
import SearchList from "./searchList";

class HomePage extends Component {
  render() {
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
        <Col span={20}>
          <Typography.Title style={{ textAlign: "left" }}>
            Welcome to Pollster.
          </Typography.Title>
          <SearchBar
            size="large"
            isLoading={this.props.search.isLoading}
            searchType={this.props.search.searchType}
          />
          <SearchList
            results={this.props.search.payload}
            isLoading={this.props.search.isLoading}
            searchType={this.props.search.searchType}
          />
          {this.props.search.payload.length ? <Paginator /> : null}
        </Col>
      </Row>
    );
  }
}

const mapStateToProps = state => ({ search: state.header.search });

export default connect(mapStateToProps)(HomePage);
