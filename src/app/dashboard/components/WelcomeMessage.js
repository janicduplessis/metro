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

const PresetsSection = require("./PresetsSection");

const React = require("react");

const _require = require("emotion"),
  css = _require.css;

const message = css`
  text-align: center;
  margin-top: 8px;
  margin-bottom: 16px;
`;

class WelcomeMessage extends React.Component {
  constructor() {
    super(...arguments);

    _defineProperty(this, "_onReloadClick", e => {
      e.preventDefault();
      this.props.onReload();
    });
  }

  render() {
    const _this$props = this.props,
      presets = _this$props.presets,
      platforms = _this$props.platforms,
      onBuildPreset = _this$props.onBuildPreset;
    const havePresets = !!(presets && presets.length);
    return React.createElement(
      React.Fragment,
      null,
      havePresets
        ? React.createElement(PresetsSection, {
            presets: presets,
            platforms: platforms,
            onBuildPreset: onBuildPreset
          })
        : null,
      React.createElement(
        _antd.Row,
        {
          type: "flex",
          justify: "center"
        },
        React.createElement(
          _antd.Col,
          {
            span: 16,
            className: message
          },
          havePresets ? "" : "I don't see any bundles here. ",
          "If you've started a build externally,",
          " ",
          React.createElement(
            "a",
            {
              href: "#",
              onClick: this._onReloadClick
            },
            "reload this page"
          ),
          " ",
          "to see it."
        )
      )
    );
  }
}

module.exports = WelcomeMessage;
