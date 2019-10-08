import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { createPoll } from "../store/actions/poll.actions";
import { Row, Col, Typography, Button, Form, Icon, Input, message } from "antd";

const { Title, Paragraph } = Typography;
let id = 2;

class PollForm extends Component {
  componentWillMount() {
    this.props.form.resetFields();
  }

  remove = k => {
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

  add = () => {
    const { form } = this.props;
    // can use data-binding to get
    const keys = form.getFieldValue("keys");
    if (keys.length >= 10) {
      return;
    }
    const nextKeys = keys.concat(id++);
    // can use data-binding to set
    // important! notify form to detect changes
    form.setFieldsValue({
      keys: nextKeys
    });
  };

  handleSubmit = e => {
    e.preventDefault();

    this.props.form.validateFields(async (err, values) => {
      if (!err) {
        let { auth } = this.props;
        let objOptions = [];

        for (var index in values.options) {
          objOptions.push({ option: values.options[index], votes: 0 });
        }

        let pollData = {
          creator: auth.id,
          title: values.title,
          description: values.description,
          options: objOptions
        };

        await this.props.createPoll(pollData);

        setTimeout(() => {
          let { error } = this.props.poll;
          if (error) {
            message.error(error);
          } else {
            this.props.history.push(`/polls/${this.props.poll._id}`);
          }
        }, 1000);
      }
    });
  };

  render() {
    const { getFieldDecorator, getFieldValue } = this.props.form;
    getFieldDecorator("keys", { initialValue: [0, 1] });
    const keys = getFieldValue("keys");
    const optionItems = keys.map((option, index) => (
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
            onClick={() => this.remove(option)}
          />
        ) : null}
      </Form.Item>
    ));

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
            <Typography>
              <Title> Create A Poll </Title>
            </Typography>
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
                  onClick={this.add}
                  style={{ width: "calc(100% - 24px)" }}
                >
                  <Icon type="plus" /> Add Option
                </Button>
              ) : (
                <Typography>
                  <Paragraph>Reached option limit.</Paragraph>
                </Typography>
              )}
            </Form.Item>
          </Col>
        </Row>
      </Form>
    );
  }
}

const mapStateToProps = state => ({
  auth: state.common.auth,
  poll: state.view.poll
});

const WrappedForm = Form.create({ name: PollForm })(PollForm);

const WrappedRouter = withRouter(WrappedForm);

export default connect(
  mapStateToProps,
  { createPoll }
)(WrappedRouter);
