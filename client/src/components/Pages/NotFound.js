import React from "react";
import { Row, Result } from "antd";

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
    <Result
      status="404"
      title="404"
      subTitle="Sorry, the page you visited does not exist."
    />
  </Row>
);

export default NotFound;
