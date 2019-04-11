import React from "react";
import { Row, Col, Typography } from "antd";
import SearchBar from "../../containers/SearchBar";
import PageControl from "../../containers/PageControl";
import ResultsList from "../../containers/ResultsList";
import LoginModal from "../../containers/LoginModal";

const Home = () => (
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
      <LoginModal />
      <Typography.Title style={{ textAlign: "left" }}>
        Welcome to Pollster.
      </Typography.Title>
      <SearchBar />
      <ResultsList />
      <PageControl />
    </Col>
  </Row>
);

export default Home;
