import React, { Component } from "react";
import { connect } from "react-redux";
import { Button } from "antd";
import { doSearch } from "../store/actions/search.actions";

class PageControl extends Component {
  //takes in one boolean value
  //boolean determine which cursor to use
  //cursors is the ID of the first (prev) and last (next) polls on the current page
  handleNavigation = goNextPage => {
    let { paging, search, doSearch, searchField } = this.props;

    doSearch(
      search.searchType,
      search.searchText,
      !goNextPage ? paging.prevCursor : null,
      goNextPage ? paging.nextCursor : null,
      searchField || "title"
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

const mapStateToProps = ({ home }) => ({
  search: home.search,
  paging: home.paging
});

export default connect(
  mapStateToProps,
  { doSearch }
)(PageControl);
