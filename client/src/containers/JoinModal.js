import React, { Component } from "react";
import { connect } from "react-redux";
import {
  loginUser,
  createUser,
  toggleJoinModal,
  toggleLoginModal
} from "../store/actions/auth.actions";
import { Button, Modal, Form, Icon, Input, message } from "antd";

class JoinModal extends Component {
  //Component refreshes after signin
  //Makes sure to pop message and toggle modal afterwards
  componentWillReceiveProps(newProps) {
    let { auth, modal, toggleJoinModal } = newProps;

    if (auth.isAuthenticated && modal.joinModal) {
      toggleJoinModal(false);
      message.success("Account created. Welcome " + auth.username);
    }
  }

  //On Submit
  //Attempt to create user
  //Timeout for response wait
  //Check for errors, otherwise signin after successful creation to get a session key
  handleSubmit = async e => {
    e.preventDefault();

    this.props.form.validateFields(async (err, values) => {
      if (!err) {
        await this.props.createUser(
          values.email,
          values.username,
          values.password
        );

        setTimeout(async () => {
          let { form, auth, loginUser } = this.props;

          if (auth.error && auth.error.includes("email")) {
            form.setFields({
              email: {
                value: values.email,
                errors: [new Error(auth.error)]
              }
            });
          } else if (auth.error && auth.error.includes("username")) {
            form.setFields({
              username: {
                value: values.username,
                errors: [new Error(auth.error)]
              }
            });
          } else if (auth.error) {
            form.setFields({
              email: {
                value: values.email,
                errors: [new Error(auth.error)]
              },
              username: {
                value: values.username,
                errors: [new Error(auth.error)]
              }
            });
          } else {
            await loginUser(values.username, values.password);
          }
        }, 1000);
      }
    });
  };

  handleCancel = () => {
    this.props.toggleJoinModal(false);
  };

  handleSwitch = () => {
    this.props.toggleJoinModal(false);
    setTimeout(() => {
      this.props.toggleLoginModal(true);
    }, 500);
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const { joinModal } = this.props.modal;

    return (
      <Modal
        visible={joinModal}
        title="Join"
        destroyOnClose={true}
        onCancel={this.handleCancel}
        footer={null}
      >
        <Form onSubmit={this.handleSubmit}>
          <Form.Item>
            {getFieldDecorator("email", {
              rules: [
                { type: "email", message: "Not a valid email." },
                { required: true, message: "Email required." }
              ]
            })(
              <Input
                prefix={
                  <Icon type="mail" style={{ color: "rgba(0,0,0,.25)" }} />
                }
                placeholder="Email"
              />
            )}
          </Form.Item>
          <Form.Item>
            {getFieldDecorator("username", {
              rules: [
                {
                  required: true,
                  whitespace: true,
                  min: 7,
                  message: "Username required with at least 7 letters."
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
              rules: [
                {
                  required: true,
                  whitespace: true,
                  min: 7,
                  message: "Password required with at least 7 letters."
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
              Join Polster
            </Button>
          </Form.Item>
        </Form>
        Or{" "}
        <Button
          type="link"
          onClick={this.handleSwitch}
          style={{ border: 0, padding: 0 }}
        >
          <span style={{ textDecoration: "Underline" }}>login!</span>
        </Button>
      </Modal>
    );
  }
}

const mapStateToProps = ({ common }) => ({
  auth: common.auth,
  modal: common.modal
});

const WrappedForm = Form.create({ name: "JoinForm" })(JoinModal);

export default connect(
  mapStateToProps,
  { loginUser, createUser, toggleLoginModal, toggleJoinModal }
)(WrappedForm);
