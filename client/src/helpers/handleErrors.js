import React from "react";
import { Row, Result } from "antd";
/* 
const codeDictionary = {
  1000: "Unhandled error.", //redirect
  1001: "Unknown database error has occured.", //redirect
  1100: "Access denied.", //redirect
  1101: "Login required.", //message
  1102: "Authorization required.", //message
  1201: "The poll you are looking for does not exist.", //redirect
  1202: "The user you are looking for does not exist.", //redirect
  1300: "An account with this field already exists.", //message
  1301: "Incorrect credentials."
}; */

export function renderErrorPage(code = 1000, msg = "Unhandled error.") {
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
      <Result status="error" title={`Error Code ${code}`} subTitle={msg} />
    </Row>
  );
}
