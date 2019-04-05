import React from "react";
import { List, Icon } from "antd";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

const IconText = ({ type, text }) => (
  <span>
    <Icon type={type} style={{ marginRight: 8 }} />
    {text}
  </span>
);

const ResultsList = ({ isLoading, payload, searchType }) => (
  <List
    itemLayout="horizontal"
    size="small"
    locale={{ emptyText: "No results." }}
    loading={isLoading}
    dataSource={payload}
    style={{ textAlign: "left" }}
    renderItem={item => (
      <List.Item
        actions={[
          <Link
            to={`/${searchType}/${item._id}`}
            style={{ textTransform: "capitalize" }}
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

const mapStateToProps = state => ({
  isLoading: state.header.search.isLoading,
  payload: state.header.search.payload,
  searchType: state.header.search.searchType
});

export default connect(mapStateToProps)(ResultsList);
