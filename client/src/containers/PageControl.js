import React, { Component } from "react";
import { connect } from "react-redux";
import { Button } from "antd";
import { doSearch } from "../store/actions/search.actions";

class PageControl extends Component {
  //takes in one boolean value
  //to determine which cursor to use
  //cursors is the ID of the first (prev) and last (next) polls on the current page
  handleNavigation = goNext => {
    let { nextCursor, prevCursor } = this.props.paging;
    let { searchType, searchText } = this.props.search;

    this.props.doSearch(
      searchType,
      searchText,
      !goNext ? prevCursor : null,
      goNext ? nextCursor : null
    );
  };

  render() {
    let { page, totalPages } = this.props.paging;
    return (
      <div>
        {totalPages > 0 && (
          <div>
            <Button
              style={{ border: "none", background: "transparent" }}
              disabled={!page}
              onClick={() => this.handleNavigation(false)}
            >
              Prev
            </Button>
            <span>/</span>
            <Button
              style={{ border: "none", background: "transparent" }}
              disabled={page + 1 === totalPages}
              onClick={() => this.handleNavigation(true)}
            >
              Next
            </Button>
          </div>
        )}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  search: state.home.search,
  paging: state.home.paging
});

export default connect(
  mapStateToProps,
  { doSearch }
)(PageControl);
