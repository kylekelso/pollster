import React from "react";
import { List, Icon } from "antd";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { resetSearch } from "./../store/actions/search.actions";

const IconText = ({ type, text }) => (
  <span>
    <Icon type={type} style={{ marginRight: 8 }} />
    {text}
  </span>
);

const ResultsList = ({ search, resetSearch }) => {
  let { isLoading, polls, accounts, searchType } = search;
  return (
    <List
      itemLayout="horizontal"
      size="small"
      locale={{ emptyText: "No results." }}
      loading={isLoading}
      dataSource={polls || accounts || []}
      style={{ textAlign: "left" }}
      renderItem={item => (
        <List.Item
          actions={[
            <Link
              to={`/${searchType}/${item._id}`}
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
              <Link to={`/${searchType}/${item._id}`}>
                {item.username || item.title}
              </Link>
            }
            description={item.description}
          />
        </List.Item>
      )}
    />
  );
};

const mapStateToProps = state => ({ search: state.home.search });

export default connect(
  mapStateToProps,
  { resetSearch }
)(ResultsList);
