import React, { Component } from "react";
import { Row, Col, Button, Icon, Typography, Menu } from "antd";
import "./Navbar.css";

class Navbar extends Component {
  render() {
    return (
      <Row type="flex" justify="space-between" align="top">
        <Col xs={{ span: 7 }}>
          <Typography.Text
            className="logo"
            style={{
              textAlign: "center",
              color: "rgb(64, 169, 255)",
              fontSize: "32px"
            }}
          >
            Pollster
          </Typography.Text>
        </Col>
        <Col
          xs={{ span: 5 }}
          sm={{ span: 16 }}
          style={{ maxWidth: "335px", minWidth: "85px" }}
        >
          <Menu
            theme="dark"
            mode="horizontal"
            selectable={false}
            style={{ lineHeight: "64px" }}
            overflowedIndicator={
              <Icon type="bars" style={{ fontSize: "24px" }} />
            }
          >
            <Menu.Item key="1" id="createPoll">
              <Button ghost>Create a Poll</Button>
            </Menu.Item>
            <Menu.Item id="customDivider">&nbsp;</Menu.Item>
            <Menu.Item key="2" id="login">
              <Button ghost>Login</Button>
            </Menu.Item>
            <Menu.Item key="3" id="join">
              <Button type="primary">Join</Button>
            </Menu.Item>
          </Menu>
        </Col>
      </Row>
    );
  }
}

export default Navbar;
