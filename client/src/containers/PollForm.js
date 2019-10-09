import React, { Component } from "react";
import moment from "moment";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import {
  Row,
  Col,
  Form,
  Icon,
  Spin,
  Input,
  Button,
  Divider,
  message,
  Checkbox,
  DatePicker,
  Typography
} from "antd";
import { createPoll, disableDatePicker } from "../store/actions/poll.actions";

let id = 2;

class PollForm extends Component {
  removeItem = k => {
    const { form } = this.props;
    // can use data-binding to get
    const keys = form.getFieldValue("keys");
    if (keys.length === 2) {
      return;
    }

    // can use data-binding to set
    form.setFieldsValue({
      keys: keys.filter(key => key !== k)
    });
  };

  addItem = () => {
    const { form } = this.props;
    // can use data-binding to get
    const keys = form.getFieldValue("keys");
    if (keys.length >= 10) {
      return;
    }
    const nextKeys = keys.concat(id++);
    // can use data-binding to set
    //notify form to detect changes
    form.setFieldsValue({
      keys: nextKeys
    });
  };

  disabledDate = current => {
    return current && current < moment().endOf("day");
  };

  handleDateBoxState = e => {
    const { form, disableDatePicker } = this.props;
    disableDatePicker(!e.target.checked);

    if (!e.target.checked) {
      form.setFieldsValue({
        endDate: null
      });
    }
  };

  handleSubmit = e => {
    e.preventDefault();

    this.props.form.validateFields(async (err, values) => {
      if (!err) {
        let { auth } = this.props;
        let {
          title,
          description,
          options,
          editable,
          loginToVote,
          endDate
        } = values;
        let objOptions = [];

        for (var index in options) {
          objOptions.push({ option: options[index], votes: 0 });
        }

        let pollData = {
          creator: auth.id,
          title: title,
          description: description,
          options: objOptions,
          settings: {
            editable,
            loginToVote,
            endDate: endDate ? endDate.format() : null
          }
        };

        await this.props.createPoll(pollData);

        setTimeout(() => {
          let { poll, history } = this.props;
          if (poll.error) {
            message.error(poll.error.msg);
          } else {
            history.push(`/polls/${poll._id}`);
          }
        }, 1000);
      }
    });
  };

  renderOptions = (getFieldDecorator, keys) => {
    return keys.map((option, index) => (
      <Form.Item
        xs={{ span: 24, offset: 0 }}
        style={{ margin: 0, textAlign: "left" }}
        required={false}
        key={option}
      >
        {getFieldDecorator(`options[${option}]`, {
          validateTrigger: ["onChange", "onBlur"],
          rules: [
            {
              required: true,
              whitespace: true,
              message: "Please delete this field or add a valid option."
            }
          ]
        })(
          <Input
            placeholder={`Option ${index + 1}`}
            style={{ width: "calc(100% - 24px)", marginRight: 8 }}
          />
        )}
        {keys.length > 2 ? (
          <Icon
            className="dynamic-delete-button"
            type="minus-circle-o"
            onClick={() => this.removeItem(option)}
          />
        ) : null}
      </Form.Item>
    ));
  };

  render() {
    const { getFieldDecorator, getFieldValue } = this.props.form;
    getFieldDecorator("keys", { initialValue: [0, 1] });
    const keys = getFieldValue("keys");
    const optionItems = this.renderOptions(getFieldDecorator, keys);

    if (this.props.poll.isLoading) {
      return (
        <Row
          style={{
            background: "#fff",
            padding: 24,
            minHeight: "75vh",
            marginTop: "5vh",
            textAlign: "center"
          }}
        >
          <Spin />
        </Row>
      );
    } else {
      return (
        <Form
          onSubmit={this.handleSubmit}
          style={{
            background: "#fff",
            padding: 24,
            minHeight: "75vh",
            marginTop: "5vh",
            textAlign: "center"
          }}
        >
          <Row type="flex" justify="center">
            <Col xs={{ span: 24 }}>
              <Typography.Title>Create A Poll</Typography.Title>
            </Col>
          </Row>
          <Row type="flex" justify="center">
            <Col xs={{ span: 24 }} sm={{ span: 11 }}>
              <Form.Item style={{ margin: 0, width: "calc(100% - 24px)" }}>
                {getFieldDecorator("title", {
                  rules: [
                    {
                      required: true,
                      min: 5,
                      message: "A title is required with at least five letters."
                    }
                  ]
                })(
                  <Input
                    prefix={
                      <Icon type="user" style={{ color: "rgba(0,0,0,.25)" }} />
                    }
                    placeholder="Title"
                  />
                )}
              </Form.Item>
              <Form.Item style={{ margin: 0, width: "calc(100% - 24px)" }}>
                {getFieldDecorator("description")(
                  <Input
                    prefix={
                      <Icon type="user" style={{ color: "rgba(0,0,0,.25)" }} />
                    }
                    placeholder="Description"
                  />
                )}
              </Form.Item>
              <Divider orientation="left">Settings</Divider>
              <Row>
                <Col xs={{ span: 24 }} sm={{ span: 12 }}>
                  <Form.Item style={{ margin: 0, textAlign: "left" }}>
                    {getFieldDecorator("loginToVote", {
                      initialValue: true,
                      valuePropName: "checked"
                    })(<Checkbox>Private Voting</Checkbox>)}
                  </Form.Item>
                  <Form.Item style={{ margin: 0, textAlign: "left" }}>
                    {getFieldDecorator("editable", {
                      initialValue: true,
                      valuePropName: "checked"
                    })(<Checkbox>Editable</Checkbox>)}
                  </Form.Item>
                </Col>
                <Col xs={{ span: 24 }} sm={{ span: 12 }}>
                  <Form.Item style={{ margin: 0, textAlign: "left" }}>
                    <Checkbox defaultChecked onChange={this.handleDateBoxState}>
                      Has End Date
                    </Checkbox>
                  </Form.Item>
                  <Form.Item style={{ margin: 0, textAlign: "left" }}>
                    {getFieldDecorator("endDate", { initialValue: null })(
                      <DatePicker
                        allowClear={true}
                        disabled={this.props.poll.disableDate}
                        disabledDate={this.disabledDate}
                      />
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Divider />
              <Form.Item
                style={{
                  marginTop: 12,
                  marginRight: 24,
                  textAlign: "right",
                  height: 48
                }}
              >
                <Button type="primary" htmlType="submit">
                  Submit
                </Button>
              </Form.Item>
            </Col>
            <Col xs={{ span: 24, offset: 0 }} sm={{ span: 11, offset: 1 }}>
              {optionItems}
              <Form.Item
                xs={{ span: 24, offset: 0 }}
                style={{ marginTop: 12, textAlign: "left", height: 48 }}
              >
                {keys.length < 10 ? (
                  <Button
                    type="dashed"
                    onClick={this.addItem}
                    style={{ width: "calc(100% - 24px)" }}
                  >
                    <Icon type="plus" /> Add Option
                  </Button>
                ) : (
                  <Typography.Paragraph>
                    Reached option limit.
                  </Typography.Paragraph>
                )}
              </Form.Item>
            </Col>
          </Row>
        </Form>
      );
    }
  }
}

const mapStateToProps = state => ({
  auth: state.common.auth,
  poll: state.view.poll
});

const WrappedForm = Form.create({ name: PollForm })(PollForm);

const routedForm = withRouter(WrappedForm);

export default connect(
  mapStateToProps,
  { createPoll, disableDatePicker }
)(routedForm);
