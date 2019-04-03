import React, { Component } from "react";
import { Select, Input, Icon } from "antd";
import { connect } from "react-redux";
import {
  fetchSearchResults,
  toggleSearchType
} from "./../store/actions/search.actions";

class SearchBar extends Component {
  handleSearch = search => {
    this.props.fetchSearchResults(this.props.searchType, search);
  };

  render() {
    return (
      <div>
        <Input.Group size={this.props.size} compact>
          <Select
            defaultValue={this.props.searchType}
            size={this.props.size}
            style={{ width: "90px" }}
            onChange={this.props.toggleSearchType}
          >
            <Select.Option value="polls">Polls</Select.Option>
            <Select.Option value="users">Users</Select.Option>
          </Select>
          <Input.Search
            size={this.props.size}
            disabled={this.props.isLoading}
            placeholder={"Search " + this.props.searchType + "..."}
            onSearch={value => this.handleSearch(value)}
            prefix={
              this.props.isLoading && (
                <Icon type="loading" style={{ color: "rgba(0,0,0,.45)" }} />
              )
            }
            style={{
              width: "calc(100% - 90px)"
            }}
          />
        </Input.Group>
      </div>
    );
  }
}

export default connect(
  null,
  { fetchSearchResults, toggleSearchType }
)(SearchBar);
