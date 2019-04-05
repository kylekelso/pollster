import React, { Component } from "react";
import { connect } from "react-redux";
import { Button } from "antd";
import { fetchSearchResults } from "./../store/actions/search.actions";

class Paginator extends Component {
  handleNavigation = goNext => {
    let { searchType, searchText, nextCursor, prevCursor } = this.props.search;
    this.props.fetchSearchResults(
      searchType,
      searchText,
      !goNext ? prevCursor : null,
      goNext ? nextCursor : null
    );
  };

  render() {
    return (
      <div>
        <Button
          style={{ border: "none", background: "transparent" }}
          disabled={!this.props.search.page}
          onClick={() => this.handleNavigation(false)}
        >
          Prev
        </Button>
        <span>/</span>
        <Button
          style={{ border: "none", background: "transparent" }}
          disabled={this.props.search.page + 1 === this.props.search.totalPages}
          onClick={() => this.handleNavigation(true)}
        >
          Next
        </Button>
      </div>
    );
  }
}

function mapStateToProps({ header }) {
  return { search: header.search };
}

export default connect(
  mapStateToProps,
  { fetchSearchResults }
)(Paginator);
