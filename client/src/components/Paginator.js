import React, { Component } from "react";
import { connect } from "react-redux";
import { Button } from "antd";
import { fetchSearchResults } from "./../store/actions/search.actions";

class Paginator extends Component {
  handleNavigation = goNext => {
    let { nextCursor, prevCursor } = this.props.paging;
    let { searchType, searchText } = this.props.search;
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
          disabled={!this.props.paging.page}
          onClick={() => this.handleNavigation(false)}
        >
          Prev
        </Button>
        <span>/</span>
        <Button
          style={{ border: "none", background: "transparent" }}
          disabled={this.props.paging.page + 1 === this.props.paging.totalPages}
          onClick={() => this.handleNavigation(true)}
        >
          Next
        </Button>
      </div>
    );
  }
}

function mapStateToProps({ header }) {
  return { search: header.search, paging: header.paging };
}

export default connect(
  mapStateToProps,
  { fetchSearchResults }
)(Paginator);
