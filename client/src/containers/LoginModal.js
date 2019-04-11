import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { loginUser, toggleLoginModal } from "../store/actions/auth.actions";
import { Button, Modal, Form, Icon, Input, message } from "antd";

class LoginModal extends Component {
  componentWillReceiveProps(newProps) {
    let { auth, modal, toggleLoginModal } = newProps;

    if (auth.isAuthenticated && modal.loginModal) {
      toggleLoginModal(false);
      message.success("Logged in.");
    }
  }

  handleSubmit = e => {
    e.preventDefault();

    this.props.form.validateFields(async (err, values) => {
      if (!err) {
        await this.props.loginUser(values.password, values.username);
        if (this.props.auth.error) {
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
    const { loginModal } = this.props.modal;

    return (
      <Modal
        visible={loginModal}
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

const mapStateToProps = state => ({
  auth: state.common.auth,
  modal: state.common.modal
});

const WrappedForm = Form.create({ name: "LoginForm" })(LoginModal);

export default connect(
  mapStateToProps,
  { loginUser, toggleLoginModal }
)(WrappedForm);
