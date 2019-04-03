import React, { Component } from "react";
import { Row, Col } from "antd";
import { connect } from "react-redux";
import SearchBar from "../components/SearchBar";

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
          <SearchBar
            size="large"
            isLoading={this.props.search.isLoading}
            searchType={this.props.search.searchType}
          />
        </Col>
      </Row>
    );
  }
}

const mapStateToProps = state => ({ search: state.header.search });

export default connect(mapStateToProps)(HomePage);
