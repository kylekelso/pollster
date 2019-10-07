import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import {
  loginUser,
  createUser,
  toggleJoinModal
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
          let { error } = this.props.auth;
          if (error && error.includes("email")) {
            this.props.form.setFields({
              email: {
                value: values.email,
                errors: [new Error(this.props.auth.error)]
              }
            });
          } else if (error && error.includes("username")) {
            this.props.form.setFields({
              username: {
                value: values.username,
                errors: [new Error(this.props.auth.error)]
              }
            });
          } else if (error) {
            this.props.form.setFields({
              email: {
                value: values.email,
                errors: [new Error(this.props.auth.error)]
              },
              username: {
                value: values.username,
                errors: [new Error(this.props.auth.error)]
              }
            });
          } else {
            await this.props.loginUser(values.username, values.password);
          }
        }, 1000);
      }
    });
  };

  handleCancel = () => {
    this.props.toggleJoinModal(false);
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const { joinModal } = this.props.modal;

    return (
      <Modal
        visible={joinModal}
        title="Join"
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
              Join Polster
            </Button>
            Or <Link to="/join">login!</Link>
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

const WrappedForm = Form.create({ name: "JoinForm" })(JoinModal);

export default connect(
  mapStateToProps,
  { loginUser, createUser, toggleJoinModal }
)(WrappedForm);
