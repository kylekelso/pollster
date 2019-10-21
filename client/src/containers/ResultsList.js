import React, { Component } from "react";
import { List, Icon, message } from "antd";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { resetSearch } from "./../store/actions/search.actions";

const IconText = ({ type, text }) => (
  <span>
    <Icon type={type} style={{ marginRight: 8 }} />
    {text}
  </span>
);

class ResultsList extends Component {
  truncateDescription = (text, charCutoff) => {
    var truncated = text || "";
    if (truncated.length > charCutoff) {
      truncated = truncated.substring(0, charCutoff) + "...";
    }

    return truncated;
  };

  render() {
    let { search, resetSearch } = this.props;
    let { isLoading, polls, accounts, searchType } = search;

    return (
      <List
        itemLayout="horizontal"
        size="small"
        locale={{ emptyText: "No results." }}
        loading={isLoading}
        dataSource={polls || accounts || []}
        style={{
          textAlign: "left",
          overflowWrap: "break-word",
          wordBreak: "break-word"
        }}
        renderItem={item => (
          <List.Item
            actions={[
              <Link
                to={`/${searchType}/${item.username || item._id}`}
                style={{ textTransform: "capitalize" }}
                onClick={resetSearch}
              >
                View {searchType.slice(0, -1)}
              </Link>,
              <IconText
                type={searchType === "users" ? "pie-chart" : "check"}
                text={searchType === "users" ? item.pollCount : item.totalVotes}
              />
            ]}
          >
            <List.Item.Meta
              title={
                <Link
                  to={`/${searchType}/${item.username || item._id}`}
                  onClick={resetSearch}
                >
                  {this.truncateDescription(item.username || item.title, 25)}
                </Link>
              }
              //description={item.description}
              description={this.truncateDescription(item.description, 60)}
            />
          </List.Item>
        )}
      />
    );
  }
}

const mapStateToProps = state => ({ search: state.home.search });

export default connect(
  mapStateToProps,
  { resetSearch }
)(ResultsList);
