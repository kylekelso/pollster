import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { loginUser, toggleLoginModal } from "../store/actions/auth.actions";
import { Button, Modal, Form, Icon, Input, message } from "antd";

class LoginModal extends Component {
  componentWillReceiveProps(newProps) {
    let { isAuthenticated } = this.props.auth;

    if (newProps.auth.isAuthenticated !== isAuthenticated) {
      this.props.toggleLoginModal(false);
      message.success("Logged in.");
    }
  }

  handleSubmit = e => {
    e.preventDefault();

    this.props.form.validateFields(async (err, values) => {
      if (!err) {
        await this.props.loginUser(values.password, values.username);
        if (this.props.auth.error !== null) {
          this.props.form.setFields({
            username: {
              value: values.username,
              errors: [new Error("Incorrect credentials.")]
            },
            password: {
              value: values.password,
              errors: [new Error("Incorrect credentials.")]
            }
          });
        }
      }
    });
  };

  handleCancel = () => {
    this.props.toggleLoginModal(false);
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const { showLogin } = this.props.auth;

    return (
      <Modal
        visible={showLogin}
        title="Login"
        onCancel={this.handleCancel}
        footer={null}
      >
        <Form onSubmit={this.handleSubmit}>
          <Form.Item>
            {getFieldDecorator("username", {
              rules: [{ required: true, message: "Username required." }]
            })(
              <Input
                prefix={
                  <Icon type="user" style={{ color: "rgba(0,0,0,.25)" }} />
                }
                placeholder="Username"
              />
            )}
          </Form.Item>
          <Form.Item>
            {getFieldDecorator("password", {
              rules: [{ required: true, message: "Password required." }]
            })(
              <Input
                prefix={
                  <Icon type="lock" style={{ color: "rgba(0,0,0,.25)" }} />
                }
                type="password"
                placeholder="Password"
              />
            )}
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" style={{ width: "100%" }}>
              Log in
            </Button>
            Or <Link to="/register">register now!</Link>
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}

function mapStateToProps({ common }) {
  return { auth: common.auth };
}

const WrappedForm = Form.create({ name: "LoginForm" })(LoginModal);

export default connect(
  mapStateToProps,
  { loginUser, toggleLoginModal }
)(WrappedForm);
