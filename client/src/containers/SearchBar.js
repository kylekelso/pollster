import React, { Component } from "react";
import { Input, Icon, Radio } from "antd";
import { connect } from "react-redux";
import { doSearch, setSearchType } from "./../store/actions/search.actions";

class SearchBar extends Component {
  render() {
    let { doSearch, setSearchType } = this.props;
    let { isLoading, searchType } = this.props.search;
    return (
      <Input.Group size="large" compact>
        <Radio.Group
          defaultValue={searchType}
          size="large"
          style={{ width: "130px" }}
          onChange={e => setSearchType(e.target.value)}
        >
          <Radio.Button value="polls" style={{ width: "65px" }}>
            Polls
          </Radio.Button>
          <Radio.Button
            value="users"
            style={{ width: "65px", borderRadius: "0px" }}
          >
            Users
          </Radio.Button>
        </Radio.Group>
        <Input.Search
          size="large"
          disabled={isLoading}
          placeholder={"Search " + searchType + "..."}
          onSearch={text => doSearch(searchType, text)}
          prefix={
            isLoading && (
              <Icon type="loading" style={{ color: "rgba(0,0,0,.45)" }} />
            )
          }
          style={{
            width: "calc(100% - 130px)"
          }}
        />
      </Input.Group>
    );
  }
}

const mapStateToProps = state => ({ search: state.home.search });

export default connect(
  mapStateToProps,
  { doSearch, setSearchType }
)(SearchBar);
