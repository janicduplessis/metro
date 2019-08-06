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

var _reactVis = require("react-vis");

function _toConsumableArray(arr) {
  return (
    _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread()
  );
}

function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance");
}

function _iterableToArray(iter) {
  if (
    Symbol.iterator in Object(iter) ||
    Object.prototype.toString.call(iter) === "[object Arguments]"
  )
    return Array.from(iter);
}

function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++)
      arr2[i] = arr[i];
    return arr2;
  }
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

const React = require("react");

const filesize = require("filesize");

const _require = require("emotion"),
  css = _require.css;

class BundlePlots extends React.Component {
  constructor() {
    super(...arguments);

    _defineProperty(this, "state", {
      crosshairValues: []
    });

    _defineProperty(this, "handleNearestX", (value, data) => {
      const build = this.props.builds[data.index];
      this.setState({
        crosshairValues: [
          {
            x: data.index,
            y: build.duration
          },
          {
            x: data.index,
            y: build.bundleSize
          },
          {
            x: data.index,
            y: build.numModifiedFiles
          }
        ]
      });
    });
  }

  render() {
    const timeData = this.props.builds.map((build, index) => ({
      x: index,
      y: build.duration
    }));
    const buildSizes = this.props.builds.map(build =>
      build.bundleSize != null ? build.bundleSize : 0
    );
    const minSize = Math.min.apply(Math, _toConsumableArray(buildSizes));
    const sizeData = buildSizes.map((size, index) => ({
      x: index,
      y: size - minSize * 0.999
    }));
    const filesData = this.props.builds.map((build, index) => ({
      x: index,
      y: build.numModifiedFiles != null ? build.numModifiedFiles : 0
    }));
    return React.createElement(
      "div",
      {
        className: plotContainer
      },
      React.createElement(
        _reactVis.XYPlot,
        {
          width: 200,
          height: 100,
          onMouseLeave: () =>
            this.setState({
              crosshairValues: []
            })
        },
        React.createElement(_reactVis.LineMarkSeries, {
          color: "#ef4242",
          curve: "curveMonotoneX",
          onNearestX: this.handleNearestX,
          data: timeData
        }),
        React.createElement(
          _reactVis.Crosshair,
          {
            values: this.state.crosshairValues
          },
          this.state.crosshairValues.length > 0 &&
            React.createElement(
              "div",
              {
                className: crosshair,
                key: this.state.crosshairValues[0].x
              },
              React.createElement(
                "p",
                null,
                this.state.crosshairValues[0].y,
                " ms"
              )
            )
        )
      ),
      React.createElement(
        _reactVis.XYPlot,
        {
          width: 200,
          height: 100,
          onMouseLeave: () =>
            this.setState({
              crosshairValues: []
            })
        },
        React.createElement(_reactVis.VerticalBarSeries, {
          color: "#ef4242",
          curve: "curveMonotoneX",
          onNearestX: this.handleNearestX,
          data: sizeData
        }),
        React.createElement(
          _reactVis.Crosshair,
          {
            values: this.state.crosshairValues
          },
          this.state.crosshairValues.length > 0 &&
            typeof this.state.crosshairValues[1].y === "number" &&
            React.createElement(
              "div",
              {
                className: crosshair,
                key: this.state.crosshairValues[1].x
              },
              React.createElement(
                "p",
                null,
                filesize(this.state.crosshairValues[1].y)
              )
            )
        )
      ),
      React.createElement(
        _reactVis.XYPlot,
        {
          width: 200,
          height: 100,
          onMouseLeave: () =>
            this.setState({
              crosshairValues: []
            })
        },
        React.createElement(_reactVis.AreaSeries, {
          color: "#ef4242",
          curve: "curveMonotoneX",
          onNearestX: this.handleNearestX,
          data: filesData
        }),
        React.createElement(
          _reactVis.Crosshair,
          {
            values: this.state.crosshairValues
          },
          this.state.crosshairValues.length > 0 &&
            React.createElement(
              "div",
              {
                className: crosshair,
                key: this.state.crosshairValues[2].x
              },
              React.createElement(
                "p",
                null,
                this.state.crosshairValues[2].y,
                " files"
              )
            )
        )
      )
    );
  }
}

const plotContainer = css`
  width: 100%;
  height: 100;
  display: flex;
  justify-content: space-around;
`;
const crosshair = css`
  background: none;
  margin-top: 60px;
`;
module.exports = BundlePlots;
