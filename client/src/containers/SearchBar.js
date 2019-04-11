import React, { Component } from "react";
import { Select, Input, Icon } from "antd";
import { connect } from "react-redux";
import {
  fetchSearchResults,
  toggleSearchType
} from "./../store/actions/search.actions";

class SearchBar extends Component {
  render() {
    let { toggleSearchType, fetchSearchResults } = this.props;
    let { isLoading, searchType } = this.props.search;
    return (
      <div>
        <Input.Group size="large" compact>
          <Select
            defaultValue={searchType}
            size="large"
            style={{ width: "90px" }}
            onChange={toggleSearchType}
          >
            <Select.Option value="polls">Polls</Select.Option>
            <Select.Option value="users">Users</Select.Option>
          </Select>
          <Input.Search
            size="large"
            disabled={isLoading}
            placeholder={"Search " + searchType + "..."}
            onSearch={text => fetchSearchResults(searchType, text)}
            prefix={
              isLoading && (
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

const mapStateToProps = state => ({ search: state.home.search });

export default connect(
  mapStateToProps,
  { fetchSearchResults, toggleSearchType }
)(SearchBar);
