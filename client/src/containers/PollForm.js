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
import {
  createPoll,
  editPoll,
  disableDatePicker
} from "../store/actions/poll.actions";
import { fetchPoll } from "./../store/actions/view.actions";

let id = 2;

class PollForm extends Component {
  async componentDidMount() {
    await this.props.fetchPoll(this.props.match.params.poll_id);
  }

  removeItem = k => {
    let { form } = this.props;
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
    let { form } = this.props;
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
        let { auth, poll } = this.props;
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

        let settings = {
          editable,
          loginToVote,
          endDate: endDate ? endDate.format() : null
        };

        let pollData = {
          creator: auth.id,
          title: title,
          description: description,
          options: objOptions,
          settings: settings
        };

        if (this.props.type === "edit") {
          await this.props.editPoll(poll._id, { title, description, settings });
        } else {
          await this.props.createPoll(pollData);
        }

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

  renderOptions = (
    getFieldDecorator,
    keys,
    initVals = [{ label: "" }, { label: "" }]
  ) => {
    return keys.map((option, index) => (
      <Form.Item
        xs={{ span: 24, offset: 0 }}
        style={{ margin: 0, textAlign: "left" }}
        disabled={this.props.type === "edit"}
        required={false}
        key={option}
      >
        {getFieldDecorator(`options[${option}]`, {
          initialValue: initVals[index] ? initVals[index].label : "",
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
            disabled={this.props.type === "edit"}
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

  setInitialValues = () => {
    let { type, poll } = this.props;
    let { editable, loginToVote, endDate } = this.props.poll.settings;
    let k = [0, 1];

    for (let i in poll.options) {
      if (i > 1) {
        k.push(i);
      }
    }

    return {
      keys: k,
      title: type === "edit" ? poll.title : "",
      description: type === "edit" ? poll.description : "",
      options: type === "edit" ? poll.options : [],
      editable: type === "edit" ? editable : true,
      loginToVote: type === "edit" ? loginToVote : true,
      endDateCheck: type === "edit" && endDate === null ? false : true,
      endDate: type === "edit" && endDate ? moment(endDate) : null
    };
  };

  render() {
    let { getFieldDecorator, getFieldValue } = this.props.form;
    let { type, poll } = this.props;

    if (poll.isLoading || (type === "edit" && poll._id === null)) {
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
      let initVals = this.setInitialValues();
      getFieldDecorator("keys", { initialValue: initVals.keys });
      const keys = getFieldValue("keys");
      const optionItems = this.renderOptions(
        getFieldDecorator,
        keys,
        initVals.options
      );

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
                  initialValue: initVals.title,
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
                {getFieldDecorator("description", {
                  initialValue: initVals.description
                })(
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
                      initialValue: initVals.loginToVote,
                      valuePropName: "checked"
                    })(<Checkbox>Private Voting</Checkbox>)}
                  </Form.Item>
                  <Form.Item style={{ margin: 0, textAlign: "left" }}>
                    {getFieldDecorator("editable", {
                      initialValue: initVals.editable,
                      valuePropName: "checked"
                    })(<Checkbox>Editable</Checkbox>)}
                  </Form.Item>
                </Col>
                <Col xs={{ span: 24 }} sm={{ span: 12 }}>
                  <Form.Item style={{ margin: 0, textAlign: "left" }}>
                    <Checkbox
                      defaultChecked={initVals.endDateCheck}
                      onChange={this.handleDateBoxState}
                    >
                      Has End Date
                    </Checkbox>
                  </Form.Item>
                  <Form.Item style={{ margin: 0, textAlign: "left" }}>
                    {getFieldDecorator("endDate", {
                      initialValue: initVals.endDate
                    })(
                      <DatePicker
                        allowClear={true}
                        disabled={
                          poll.disableDate === null
                            ? !initVals.endDateCheck
                            : poll.disableDate
                        }
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
                    disabled={type === "edit"}
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
  { createPoll, editPoll, disableDatePicker, fetchPoll }
)(routedForm);
