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

const Cytoscape = require("cytoscape");

const DependencyGraph = require("./components/DependencyGraph");

const InfoDrawer = require("./components/InfoDrawer");

const OptionsDrawer = require("./components/OptionsDrawer");

const React = require("react");

const SearchBar = require("./components/SearchBar");

const handleAPIError = require("../utils/handleAPIError");

const _require = require("emotion"),
  css = _require.css;

Cytoscape.use(require("cytoscape-euler"));

class GraphApp extends React.Component {
  constructor() {
    super(...arguments);

    _defineProperty(this, "state", {
      showLoadingIndicator: true,
      showPathSearch: false,
      graphOptions: {
        layoutName: "dagre"
      },
      graphFilters: {}
    });

    _defineProperty(this, "handleModuleSelection", modulePath => {
      this.firstModule = modulePath;

      if (!this.state.showPathSearch) {
        this.setState({
          showLoadingIndicator: true
        });
        fetch(
          `/visualizer/graph/modules/${modulePath}?hash=${
            this.props.match.params[0]
          }`
        )
          .then(res => {
            this.setState({
              showLoadingIndicator: false
            });
            return handleAPIError(res);
          })
          .then(response => response.json())
          .then(graph =>
            this.setState({
              graph
            })
          )
          .catch(error => _antd.message.error(error.message));
      }
    });

    _defineProperty(this, "handleSecondModuleSelection", modulePath => {
      this.setState({
        showLoadingIndicator: true
      });
      fetch(
        `/visualizer/graph/modules/${this.firstModule}?to=${modulePath}&hash=${
          this.props.match.params[0]
        }`
      )
        .then(res => {
          this.setState({
            showLoadingIndicator: false
          });
          return handleAPIError(res);
        })
        .then(response => response.json())
        .then(graph =>
          this.setState({
            graph
          })
        )
        .catch(error => _antd.message.error(error.message));
    });

    _defineProperty(this, "handleOptionChange", options => {
      this.setState({
        graphOptions: options
      });
    });

    _defineProperty(this, "handleFilterChange", filters => {
      this.setState({
        graphFilters: Object.assign({}, this.state.graphFilters, filters)
      });
    });

    _defineProperty(this, "togglePathSearch", () => {
      this.setState({
        showPathSearch: !this.state.showPathSearch
      });
    });
  }

  componentDidMount() {
    fetch(`/visualizer/graph/info?hash=${this.props.match.params[0]}`)
      .then(res => {
        this.setState({
          showLoadingIndicator: false
        });
        return handleAPIError(res);
      })
      .then(response => response.json())
      .then(res => {
        this.setState(res);
      })
      .catch(error => _antd.message.error(error.message));
  }

  render() {
    return React.createElement(
      "div",
      {
        id: "container"
      },
      this.state.graph &&
        React.createElement(DependencyGraph, {
          hash: this.props.match.params[0],
          graph: this.state.graph,
          options: this.state.graphOptions,
          filters: this.state.graphFilters,
          handleSelectionChange: selectedNodeData =>
            this.setState({
              selectedNodeData
            })
        }),
      this.state.modules &&
        this.state.info &&
        React.createElement(
          "div",
          null,
          React.createElement(
            _antd.Row,
            {
              type: "flex",
              justify: "center",
              align: "middle",
              className: searchRow
            },
            React.createElement(
              _antd.Col,
              {
                span: this.state.showPathSearch ? 14 : 12,
                className: searchCol
              },
              React.createElement(SearchBar, {
                data: this.state.modules,
                onSelection: this.handleModuleSelection
              }),
              this.state.showPathSearch &&
                React.createElement(_antd.Icon, {
                  type: "arrow-right",
                  style: {
                    fontSize: 20,
                    marginTop: 10
                  }
                }),
              this.state.showPathSearch &&
                React.createElement(SearchBar, {
                  data: this.state.modules,
                  onSelection: this.handleSecondModuleSelection
                }),
              React.createElement(_antd.Button, {
                className: headerButton,
                type: "default",
                size: "large",
                onClick: this.togglePathSearch,
                icon: this.state.showPathSearch ? "close" : "share-alt"
              })
            )
          ),
          React.createElement(InfoDrawer, {
            data: this.state.selectedNodeData
          }),
          React.createElement(OptionsDrawer, {
            options: this.state.graphOptions,
            onOptionChange: this.handleOptionChange,
            onFilterChange: this.handleFilterChange,
            info: this.state.info
          })
        ),
      this.state.showLoadingIndicator &&
        React.createElement(_antd.Icon, {
          type: "loading",
          className: loadingIndicator
        })
    );
  }
}

const searchRow = css`
  margin-top: 20px;
`;
const loadingIndicator = css`
  font-size: 4em;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translateY(-50%) translateX(-50%);
`;
const headerButton = css`
  height: 40px;
  width: 40px;
`;
const searchCol = css`
  display: flex;
`;
module.exports = GraphApp;
