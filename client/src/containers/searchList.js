import React, { Component } from "react";
import { List, Icon } from "antd";

const IconText = ({ type, text }) => (
  <span>
    <Icon type={type} style={{ marginRight: 8 }} />
    {text}
  </span>
);

class DataList extends Component {
  render() {
    let { isLoading, results, searchType } = this.props;
    return (
      <List
        itemLayout="horizontal"
        size="small"
        locale={{ emptyText: "No results." }}
        loading={isLoading}
        dataSource={results}
        style={{ textAlign: "left" }}
        renderItem={item => (
          <List.Item
            actions={[
              <a href="/">View Polls</a>,
              <IconText
                type={searchType === "users" ? "pie-chart" : "check"}
                text={searchType === "users" ? item.pollCount : item.totalVotes}
              />
            ]}
          >
            <List.Item.Meta
              title={<a href="/">{item.username || item.title}</a>}
              description={item.description}
            />
          </List.Item>
        )}
      />
    );
  }
}

export default DataList;
