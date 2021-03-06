import React, { Component } from "react";
import { connect } from "react-redux";
import {
  loginUser,
  toggleJoinModal,
  toggleLoginModal
} from "../store/actions/auth.actions";
import { Button, Modal, Form, Icon, Input, message } from "antd";

class LoginModal extends Component {
  //Component refreshes after signin
  //Makes sure to pop message and toggle modal afterwards
  componentDidUpdate() {
    let { auth, modal, toggleLoginModal } = this.props;

    if (auth.isAuthenticated && modal.loginModal) {
      toggleLoginModal(false);
      message.success("Logged in.");
    }
  }

  //On Submit
  //Attempt login
  //Timeout for response wait
  //Check for errors, otherwise do nothing
  handleSubmit = e => {
    e.preventDefault();

    this.props.form.validateFields(async (err, values) => {
      if (!err) {
        await this.props.loginUser(values.username, values.password);

        setTimeout(async () => {
          let { form, auth } = this.props;
          if (auth.error) {
            form.setFields({
              username: {
                value: values.username,
                errors: [new Error(auth.error.msg)]
              },
              password: {
                value: values.password,
                errors: [new Error(auth.error.msg)]
              }
            });
          }
        }, 500);
      }
    });
  };

  handleCancel = () => {
    this.props.toggleLoginModal(false);
  };

  handleSwitch = () => {
    this.props.toggleLoginModal(false);
    setTimeout(() => {
      this.props.toggleJoinModal(true);
    }, 500);
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const { loginModal } = this.props.modal;

    return (
      <Modal
        visible={loginModal}
        title="Login"
        destroyOnClose={true}
        onCancel={this.handleCancel}
        footer={null}
      >
        <Form onSubmit={this.handleSubmit}>
          <Form.Item>
            {getFieldDecorator("username", {
              validateTrigger: ["onBlur"],
              rules: [
                {
                  required: true,
                  whitespace: true,
                  message: "Username required."
                }
              ]
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
              validateTrigger: ["onBlur"],
              rules: [
                {
                  required: true,
                  whitespace: true,
                  message: "Password required."
                }
              ]
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
          </Form.Item>
        </Form>
        Or{" "}
        <Button
          type="link"
          onClick={this.handleSwitch}
          style={{ border: 0, padding: 0 }}
        >
          <span style={{ textDecoration: "Underline" }}>register now!</span>
        </Button>
      </Modal>
    );
  }
}

const mapStateToProps = ({ common }) => ({
  auth: common.auth,
  modal: common.modal
});

const WrappedForm = Form.create({ name: "LoginForm" })(LoginModal);

export default connect(
  mapStateToProps,
  { loginUser, toggleLoginModal, toggleJoinModal }
)(WrappedForm);
