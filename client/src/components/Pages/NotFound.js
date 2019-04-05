import React from "react";
import { Row, Col, Typography } from "antd";

const NotFound = () => (
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
        Sorry! That page does not exist.
      </Typography.Title>
    </Col>
  </Row>
);

export default NotFound;
