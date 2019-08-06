/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 *
 * @format
 */

/* eslint-env browser */
"use strict";

var _antd = require("antd");

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }
  return obj;
}

const FuzzySearch = require("fuzzy-search");

const React = require("react");

const _require = require("emotion"),
  css = _require.css;

class SearchBar extends React.Component {
  constructor(props) {
    super(props);

    _defineProperty(this, "state", {
      results: [],
      query: ""
    });

    _defineProperty(this, "handleSearch", value => {
      this.setState({
        results: this.searcher.search(value),
        query: value
      });
    });

    _defineProperty(this, "handleSubmit", value => {
      this.setState({
        query: value.substring(value.lastIndexOf("/") + 1)
      });
      this.props.onSelection(value);
    });

    this.searcher = new FuzzySearch(props.data, ["name"], {
      sort: true
    });
  }

  render() {
    return React.createElement(
      _antd.AutoComplete,
      {
        size: "large",
        value: this.state.query,
        className: searchBar,
        onSearch: this.handleSearch,
        onSelect: this.handleSubmit,
        placeholder: "Search for modules",
        dataSource: this.state.results.slice(0, 10).map(module =>
          React.createElement(
            _antd.AutoComplete.Option,
            {
              key: module.filePath,
              value: module.filePath
            },
            module.name,
            React.createElement(
              "p",
              {
                style: {
                  fontSize: "7pt",
                  marginBottom: "0px"
                }
              },
              module.filePath
            )
          )
        )
      },
      React.createElement(_antd.Input, {
        suffix: React.createElement(_antd.Icon, {
          type: "search",
          className: "certain-category-icon"
        })
      })
    );
  }
}

const searchBar = css`
  margin: 0px 8px 2px 8px;
  width: 100%;
  font-size: 11pt;
`;
module.exports = SearchBar;
