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

function _objectSpread(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};
    var ownKeys = Object.keys(source);
    if (typeof Object.getOwnPropertySymbols === "function") {
      ownKeys = ownKeys.concat(
        Object.getOwnPropertySymbols(source).filter(function(sym) {
          return Object.getOwnPropertyDescriptor(source, sym).enumerable;
        })
      );
    }
    ownKeys.forEach(function(key) {
      _defineProperty(target, key, source[key]);
    });
  }
  return target;
}

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

const React = require("react");

const graphStyles = require("../graphStyles");

const _require = require("../../utils/dependencyNodes"),
  addDependencyNodes = _require.addDependencyNodes,
  expandDependencyNode = _require.expandDependencyNode;

const _require2 = require("../../utils/nodeTooltips"),
  showTooltip = _require2.showTooltip,
  hideTooltip = _require2.hideTooltip;

Cytoscape.use(require("cytoscape-dagre"));
Cytoscape.use(require("cytoscape-euler"));
Cytoscape.use(require("cytoscape-klay"));
Cytoscape.use(require("cytoscape-spread"));
Cytoscape.use(require("cytoscape-popper"));

class DependencyGraph extends React.Component {
  constructor() {
    super(...arguments);

    _defineProperty(this, "layout", {
      name: "dagre",
      animate: true,
      zoom: false,
      fit: false,
      nodeDimensionsIncludeLabels: true,
      nodeSep: 1
    });

    _defineProperty(this, "handleNodeTap", evt => {
      const node = evt.target;

      if (node.hasClass("dependencies")) {
        expandDependencyNode(this.cy, node, this.layout, this.props.hash);
      }
    });

    _defineProperty(this, "handleNodeSelect", evt => {
      const node = evt.target; // Dependency nodes do not map to actual modules; they cannot be selected.

      if (!node.hasClass("dependencies")) {
        this.props.handleSelectionChange(evt.target.data());
      }
    });

    _defineProperty(this, "handleNodeDeselect", evt => {
      this.props.handleSelectionChange();
    });
  }

  componentDidMount() {
    this.layout.name = this.props.options.layoutName;
    this.initializeCytoscape(this.props.graph);
    this.cy.on("tap", "node", this.handleNodeTap);
    this.cy.on("tapstart", "node", this.handleNodeTapStart);
    this.cy.on("mouseover", "node", this.handleNodeMouseOver);
    this.cy.on("mouseout", "node", this.handleNodeMouseOut);
    this.cy.on("select", "node", this.handleNodeSelect);
    this.cy.on("unselect", "node", this.handleNodeDeselect);
  }

  componentDidUpdate(prevProps) {
    if (this.props.graph !== prevProps.graph) {
      this.cy.remove(this.cy.elements());
      this.cy.add(this.props.graph);
      addDependencyNodes(this.cy, this.cy.nodes().toArray(), this.props.hash);
      this.cy
        .layout(
          _objectSpread({}, this.layout, {
            randomize: true
          })
        )
        .run();
    }

    this.handleOptionChange(prevProps.options, this.props.options);

    if (this.props.filters != null) {
      this.handleFilterChange(prevProps.filters, this.props.filters);
    }
  }

  initializeCytoscape(graph) {
    this.cy = new Cytoscape({
      container: document.getElementById("graph-container"),
      elements: graph,
      maxZoom: 3,
      style: graphStyles
    });
    addDependencyNodes(this.cy, this.cy.nodes().toArray(), this.props.hash);
    this.cy
      .layout(
        _objectSpread({}, this.layout, {
          randomize: true,
          fit: true
        })
      )
      .run();
  }

  handleOptionChange(prevOptions, options) {
    if (options.layoutName !== prevOptions.layoutName) {
      this.layout.name = options.layoutName;
      this.cy
        .layout(
          _objectSpread({}, this.layout, {
            randomize: true,
            fit: true
          })
        )
        .run();
    }
  }

  handleFilterChange(prevFilters, filters) {
    if (JSON.stringify(prevFilters) !== JSON.stringify(filters)) {
      this.cy
        .style()
        .selector("node")
        .style({
          display: node => {
            const depType = node.data("type");
            let incomingEdges;
            let outgoingEdges;

            if (node.hasClass("dependencies")) {
              const parent = this.cy.nodes().$id(node.data("parentNodeId"));
              incomingEdges = parent.data("inverseDeps").length;
              outgoingEdges = parent.data("deps").length;
            } else {
              incomingEdges = node.data("inverseDeps").length;
              outgoingEdges = node.data("deps").length;
            }

            if (
              filters.incomingEdgesRange != null &&
              (incomingEdges < filters.incomingEdgesRange[0] ||
                incomingEdges > filters.incomingEdgesRange[1])
            ) {
              return "none";
            }

            if (
              filters.outgoingEdgesRange != null &&
              (outgoingEdges < filters.outgoingEdgesRange[0] ||
                outgoingEdges > filters.outgoingEdgesRange[1])
            ) {
              return "none";
            }

            if (
              filters.dependencyTypes != null &&
              !filters.dependencyTypes.includes(depType)
            ) {
              return "none";
            }

            return "element";
          }
        })
        .update();
      this.cy.layout(this.layout).run();
    }
  }

  handleNodeMouseOver(evt) {
    const node = evt.target;
    node.addClass("mouseover");
    showTooltip(node);
  }

  handleNodeMouseOut(evt) {
    const node = evt.target;
    node.removeClass("mouseover");
    hideTooltip(node);
  }

  handleNodeTapStart(evt) {
    const node = evt.target;
    hideTooltip(node);
  }

  render() {
    return React.createElement("div", {
      id: "graph-container",
      style: {
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        position: "absolute"
      }
    });
  }
}

module.exports = DependencyGraph;
