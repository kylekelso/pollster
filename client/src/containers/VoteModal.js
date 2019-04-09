import React, { Component } from "react";
import { connect } from "react-redux";
import { toggleVoteModal } from "../store/actions/view.actions";
import { Form, Radio, Button, Spin, Modal } from "antd";

class VoteForm extends Component {
  handleSubmit = e => {
    e.preventDefault();

    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log("Received values of form: ", values);
      }
    });
  };

  handleCancel = () => {
    this.props.toggleVoteModal();
  };

  renderOptions = () => {
    var content = [];

    let { options } = this.props.poll.pollData;
    for (var index in options) {
      content.push(
        <Radio
          key={index}
          value={options[index].label}
          style={{
            display: "block",
            height: "28px",
            lineHeight: "28px"
          }}
        >
          {options[index].label}
        </Radio>
      );
    }

    return content;
  };

  render() {
    let { showVoteModal, isLoaded, pollData } = this.props.poll;
    let { getFieldDecorator } = this.props.form;

    return isLoaded ? (
      <Modal
        visible={showVoteModal}
        title={'Voting: "' + pollData.title + '"'}
        onCancel={this.handleCancel}
        footer={[
          <Button key="back" onClick={this.handleCancel}>
            Return
          </Button>,
          <Button key="submit" type="primary" onClick={this.handleSubmit}>
            Submit
          </Button>
        ]}
      >
        <Form>
          <Form.Item>
            {getFieldDecorator("radio-group", {
              rules: [{ required: true, message: "Selection required." }]
            })(
              <Radio.Group buttonStyle="solid">
                {this.renderOptions()}
              </Radio.Group>
            )}
          </Form.Item>
        </Form>
      </Modal>
    ) : (
      <Spin />
    );
  }
}

function mapStateToProps({ view }) {
  return { poll: view.poll };
}

const WrappedForm = Form.create({ name: "VoteForm" })(VoteForm);

export default connect(
  mapStateToProps,
  { toggleVoteModal }
)(WrappedForm);
