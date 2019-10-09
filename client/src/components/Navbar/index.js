import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import {
  toggleLoginModal,
  toggleJoinModal,
  logoutUser,
  checkSession
} from "../../store/actions/auth.actions";
import { Link } from "react-router-dom";
import { Row, Col, Button, Icon, Typography, Menu, message } from "antd";
import "./Navbar.css";

class Navbar extends Component {
  async componentDidMount() {
    await this.props.checkSession();

    message.config({
      duration: 2,
      maxCount: 3
    });
  }

  handleCreateClick = () => {
    let { auth, history } = this.props;
    if (!auth.isAuthenticated) {
      message.warning("Must be logged in to do that!");
    } else {
      history.push("/createPoll");
    }
  };

  handleLoginClick = () => {
    let { auth, toggleLoginModal } = this.props;
    if (auth.isAuthenticated) {
      message.info("Already logged in.");
    } else {
      toggleLoginModal(true);
    }
  };

  handleJoinClick = () => {
    let { auth, toggleJoinModal } = this.props;
    if (auth.isAuthenticated) {
      message.info("You are logged in.");
    } else {
      toggleJoinModal(true);
    }
  };

  handleLogoutClick = () => {
    let { logoutUser, history } = this.props;
    logoutUser();
    history.push("/");
    message.info("Successfully logged out.");
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
              ? { maxWidth: "235px", minWidth: "85px" }
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
              <Button onClick={this.handleCreateClick} ghost>
                Create a Poll
              </Button>
            </Menu.Item>
            <Menu.Item id="customDivider">&nbsp;</Menu.Item>
            {isAuthenticated && (
              <Menu.Item key="2" id="account">
                <Link to="/account">
                  <Button ghost style={{ border: "none" }}>
                    <span>Account</span>
                  </Button>
                </Link>
              </Menu.Item>
            )}
            {isAuthenticated && (
              <Menu.Item key="3" id="logout">
                <Button
                  onClick={this.handleLogoutClick}
                  ghost
                  style={{ border: "none" }}
                >
                  <span>Logout</span>
                </Button>
              </Menu.Item>
            )}
            {!isAuthenticated && (
              <Menu.Item key="4" id="login">
                <Button onClick={this.handleLoginClick} ghost>
                  Login
                </Button>
              </Menu.Item>
            )}
            {!isAuthenticated && (
              <Menu.Item key="5" id="join">
                <Button onClick={this.handleJoinClick} type="primary">
                  Join
                </Button>
              </Menu.Item>
            )}
          </Menu>
        </Col>
      </Row>
    );
  }
}

function mapStateToProps({ common }) {
  return { auth: common.auth, modal: common.modal };
}

const wrappedRouter = withRouter(Navbar);

export default connect(
  mapStateToProps,
  { toggleLoginModal, toggleJoinModal, logoutUser, checkSession }
)(wrappedRouter);
