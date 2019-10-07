import React, { Component } from "react";
import { connect } from "react-redux";
import { toggleVoteModal, submitVote } from "../store/actions/view.actions";
import { Form, Radio, Button, Spin, Modal } from "antd";

class VoteForm extends Component {
  handleSubmit = e => {
    e.preventDefault();

    this.props.form.validateFields(async (err, values) => {
      if (!err) {
        await this.props.submitVote(this.props.poll._id, values);
        this.props.form.resetFields();
        this.props.toggleVoteModal();
      }
    });
  };

  handleCancel = () => {
    this.props.form.resetFields();
    this.props.toggleVoteModal();
  };

  renderOptions = () => {
    var content = [];

    let { options } = this.props.poll;
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
    let { voteModal } = this.props.modal;
    let { options, title } = this.props.poll;
    let { getFieldDecorator } = this.props.form;

    return options ? (
      <Modal
        visible={voteModal}
        title={'Voting: "' + title + '"'}
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
            {getFieldDecorator("option", {
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

const mapStateToProps = state => ({
  poll: state.view.poll,
  modal: state.common.modal
});

const WrappedForm = Form.create({ name: "VoteForm" })(VoteForm);

export default connect(
  mapStateToProps,
  { toggleVoteModal, submitVote }
)(WrappedForm);
