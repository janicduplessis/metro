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

const React = require("react");

const _require = require("emotion"),
  css = _require.css;

class OptionsDrawer extends React.Component {
  constructor() {
    super(...arguments);

    _defineProperty(this, "state", {
      visible: false
    });

    _defineProperty(this, "showDrawer", () => {
      this.setState({
        visible: true
      });
    });

    _defineProperty(this, "onClose", () => {
      this.setState({
        visible: false
      });
    });
  }

  render() {
    return React.createElement(
      "div",
      null,
      React.createElement(_antd.Button, {
        className: optionsDrawerButton,
        type: "default",
        size: "large",
        onClick: this.showDrawer,
        icon: "setting"
      }),
      React.createElement(
        _antd.Drawer,
        {
          title: React.createElement(_antd.Icon, {
            type: "setting",
            style: {
              fontSize: 20
            }
          }),
          width: 350,
          placement: "right",
          mask: false,
          onClose: this.onClose,
          visible: this.state.visible
        },
        React.createElement(_antd.Divider, null, "Options"),
        React.createElement(
          _antd.Form,
          null,
          React.createElement(
            _antd.Form.Item,
            {
              label: "Layout"
            },
            React.createElement(
              _antd.Radio.Group,
              {
                defaultValue: this.props.options.layoutName,
                onChange: evt =>
                  this.props.onOptionChange({
                    layoutName: evt.target.value
                  })
              },
              ["dagre", "euler", "klay"].map(layout =>
                React.createElement(
                  _antd.Radio.Button,
                  {
                    value: layout,
                    key: layout
                  },
                  layout
                )
              )
            )
          )
        ),
        React.createElement(_antd.Divider, null, "Filters"),
        React.createElement(
          _antd.Form,
          null,
          React.createElement(
            _antd.Form.Item,
            {
              label: "Incoming Edges"
            },
            React.createElement(_antd.Slider, {
              range: true,
              max: this.props.info.maxIncomingEdges,
              defaultValue: [0, this.props.info.maxIncomingEdges],
              onChange: incomingEdgesRange =>
                this.props.onFilterChange({
                  incomingEdgesRange
                })
            })
          ),
          React.createElement(
            _antd.Form.Item,
            {
              label: "Outgoing Edges"
            },
            React.createElement(_antd.Slider, {
              range: true,
              max: this.props.info.maxOutgoingEdges,
              defaultValue: [0, this.props.info.maxOutgoingEdges],
              onChange: outgoingEdgesRange =>
                this.props.onFilterChange({
                  outgoingEdgesRange
                })
            })
          ),
          React.createElement(
            _antd.Form.Item,
            {
              label: "Type"
            },
            React.createElement(_antd.Checkbox.Group, {
              options: this.props.info.dependencyTypes,
              defaultValue: this.props.info.dependencyTypes,
              onChange: dependencyTypes =>
                this.props.onFilterChange({
                  dependencyTypes
                })
            })
          )
        )
      )
    );
  }
}

const optionsDrawerButton = css`
  position: absolute;
  top: 20px;
  right: 20px;
  font-size: 1.5em;
`;
module.exports = OptionsDrawer;
