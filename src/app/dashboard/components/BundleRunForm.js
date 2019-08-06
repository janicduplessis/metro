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

function _objectWithoutProperties(source, excluded) {
  if (source == null) return {};
  var target = _objectWithoutPropertiesLoose(source, excluded);
  var key, i;
  if (Object.getOwnPropertySymbols) {
    var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
    for (i = 0; i < sourceSymbolKeys.length; i++) {
      key = sourceSymbolKeys[i];
      if (excluded.indexOf(key) >= 0) continue;
      if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
      target[key] = source[key];
    }
  }
  return target;
}

function _objectWithoutPropertiesLoose(source, excluded) {
  if (source == null) return {};
  var target = {};
  var sourceKeys = Object.keys(source);
  var key, i;
  for (i = 0; i < sourceKeys.length; i++) {
    key = sourceKeys[i];
    if (excluded.indexOf(key) >= 0) continue;
    target[key] = source[key];
  }
  return target;
}

function _slicedToArray(arr, i) {
  return (
    _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest()
  );
}

function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance");
}

function _iterableToArrayLimit(arr, i) {
  var _arr = [];
  var _n = true;
  var _d = false;
  var _e = undefined;
  try {
    for (
      var _i = arr[Symbol.iterator](), _s;
      !(_n = (_s = _i.next()).done);
      _n = true
    ) {
      _arr.push(_s.value);
      if (i && _arr.length === i) break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i["return"] != null) _i["return"]();
    } finally {
      if (_d) throw _e;
    }
  }
  return _arr;
}

function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
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

const handleAPIError = require("../../utils/handleAPIError");

const _require = require("emotion"),
  css = _require.css,
  cx = _require.cx;

const fullSizeInput = css`
  display: block;
`;
const submitButton = css`
  width: 100%;
`;
const verticalMargin = css`
  margin: 4px 0;
`;

class BundleRunForm extends React.Component {
  constructor() {
    super(...arguments);

    _defineProperty(this, "state", {
      entryPath: "",
      options: [],
      platform: "ios"
    });

    _defineProperty(this, "default_options", {
      dev: false,
      minify: false,
      excludeSource: false,
      inlineSourceMap: false,
      runModule: false
    });

    _defineProperty(this, "handleOptionSelect", val => {
      this.setState({
        options: this.state.options.concat([val])
      });
    });

    _defineProperty(this, "handleOptionDeselect", val => {
      this.setState({
        options: this.state.options.filter(op => op !== val)
      });
    });

    _defineProperty(this, "handlePlatformSelect", platform => {
      this.setState({
        platform
      });
    });

    _defineProperty(this, "handleSubmit", e => {
      e.preventDefault();

      this._build();
    });
  }

  componentDidMount() {
    this._ensurePlatformInList();
  }

  componentDidUpdate() {
    this._ensurePlatformInList();
  }
  /**
   * Make sure we select a platform that's a member of the platform list given
   * in props. This is needed when, for example, our default platform 'ios'
   * isn't actually enabled in the bundler.
   */

  _ensurePlatformInList() {
    if (!this.props.platforms.includes(this.state.platform)) {
      this.setState({
        platform: this.props.platforms[0]
      });
    }
  }

  _build() {
    this.props.handleStartedBundling();
    var url = `${this.state.entryPath}?`;
    const params = {
      platform: this.state.platform
    };

    for (const _ref of Object.entries(this.default_options)) {
      var _ref2 = _slicedToArray(_ref, 2);

      const option = _ref2[0];
      const value = _ref2[1];

      if (value != null) {
        params[option] = String(value);
      }
    }

    for (const option of this.state.options) {
      params[option] = "true";
    }

    for (const key of Object.keys(params)) {
      url = url.concat(`${key}=${params[key]}&`);
    }

    fetch(url.slice(0, -1))
      .then(handleAPIError)
      .then(res => this.props.handleFinishedBundling())
      .catch(error => _antd.message.error(error.message));
  }

  build(entryPath, buildOptions) {
    this.setState(
      state => {
        const _ref3 = buildOptions || {},
          _ref3$platform = _ref3.platform,
          platform =
            _ref3$platform === void 0 ? state.platform : _ref3$platform,
          params = _objectWithoutProperties(_ref3, ["platform"]);

        return {
          entryPath,
          platform,
          options: Object.keys(params).filter(key => params[key])
        };
      },
      () => {
        this._build();
      }
    );
  }

  render() {
    return React.createElement(
      "form",
      {
        onSubmit: this.handleSubmit
      },
      React.createElement(
        _antd.Row,
        {
          type: "flex",
          gutter: 8,
          justify: "center"
        },
        React.createElement(
          _antd.Col,
          {
            xs: 16,
            sm: 5,
            lg: 6
          },
          React.createElement(_antd.Input, {
            className: cx(fullSizeInput, verticalMargin),
            name: "entry-file",
            onChange: e =>
              this.setState({
                entryPath: e.target.value
              }),
            placeholder: "Entry file...",
            value: this.state.entryPath
          })
        ),
        React.createElement(
          _antd.Col,
          {
            xs: 16,
            sm: 5,
            lg: 6
          },
          React.createElement(
            _antd.Select,
            {
              className: cx(fullSizeInput, verticalMargin),
              onSelect: this.handleOptionSelect,
              onDeselect: this.handleOptionDeselect,
              mode: "multiple",
              placeholder: "Options...",
              value: this.state.options
            },
            Object.entries(this.default_options).map(_ref4 => {
              let _ref5 = _slicedToArray(_ref4, 2),
                option = _ref5[0],
                value = _ref5[1];

              return typeof value === "boolean"
                ? React.createElement(
                    _antd.Select.Option,
                    {
                      value: option,
                      key: option
                    },
                    option
                  )
                : null;
            })
          )
        ),
        React.createElement(
          _antd.Col,
          {
            xs: 10,
            sm: 3,
            lg: 2
          },
          React.createElement(
            _antd.Select,
            {
              className: cx(fullSizeInput, verticalMargin),
              value: this.state.platform,
              onSelect: this.handlePlatformSelect
            },
            this.props.platforms.map(platform =>
              React.createElement(
                _antd.Select.Option,
                {
                  value: platform,
                  key: platform
                },
                platform
              )
            )
          )
        ),
        React.createElement(
          _antd.Col,
          {
            xs: 6,
            sm: 3,
            lg: 2
          },
          React.createElement(
            _antd.Button,
            {
              className: cx(submitButton, verticalMargin),
              type: "default",
              htmlType: "submit",
              disabled: this.state.entryPath.trim() === ""
            },
            "Build"
          )
        )
      )
    );
  }
}

module.exports = BundleRunForm;
