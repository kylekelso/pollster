import React, { Component } from "react";
import { connect } from "react-redux";
import { toggleLoginModal } from "../../store/actions/auth.actions";
import { Link } from "react-router-dom";
import { Row, Col, Button, Icon, Typography, Menu, message } from "antd";
import "./Navbar.css";

class Navbar extends Component {
  handleLoginClick = () => {
    if (this.props.auth.isAuthenticated) {
      message.info("Already logged in.");
    } else {
      this.props.toggleLoginModal(true);
    }
  };

  render() {
    let { isAuthenticated } = this.props.auth;
    return (
      <Row type="flex" justify="space-between" align="top">
        <Col xs={{ span: 7 }} style={{ minWidth: "148px" }}>
          <Typography.Text
            className="logo"
            style={{
              textAlign: "center",
              color: "rgb(64, 169, 255)",
              fontSize: "32px"
            }}
          >
            <Link to="/">
              <Icon
                type="pie-chart"
                style={{ marginLeft: "5px", marginRight: "5px" }}
              />
              Pollster
            </Link>
          </Typography.Text>
        </Col>
        <Col
          xs={{ span: 5 }}
          sm={{ span: 16 }}
          style={
            isAuthenticated
              ? { maxWidth: "255px", minWidth: "85px" }
              : { maxWidth: "335px", minWidth: "85px" }
          }
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
              <Link to="/createPoll">
                <Button ghost>Create a Poll</Button>
              </Link>
            </Menu.Item>
            <Menu.Item id="customDivider">&nbsp;</Menu.Item>
            {isAuthenticated && (
              <Menu.Item key="2" id="account" style={{ height: "62px" }}>
                <Link to="/account">
                  <Button ghost>
                    <Icon
                      type="user"
                      style={{ fontSize: "20px", margin: "0px", color: "#fff" }}
                    />
                    <span>Account</span>
                  </Button>
                </Link>
              </Menu.Item>
            )}
            {!isAuthenticated && (
              <Menu.Item key="2" id="login">
                <Button onClick={this.handleLoginClick} ghost>
                  Login
                </Button>
              </Menu.Item>
            )}
            {!isAuthenticated && (
              <Menu.Item key="3" id="join">
                <Link to="/join">
                  <Button type="primary">Join</Button>
                </Link>
              </Menu.Item>
            )}
          </Menu>
        </Col>
      </Row>
    );
  }
}

function mapStateToProps({ common }) {
  return { auth: common.auth };
}

export default connect(
  mapStateToProps,
  { toggleLoginModal }
)(Navbar);
