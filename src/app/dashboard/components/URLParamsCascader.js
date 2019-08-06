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

function _extends() {
  _extends =
    Object.assign ||
    function(target) {
      for (var i = 1; i < arguments.length; i++) {
        var source = arguments[i];
        for (var key in source) {
          if (Object.prototype.hasOwnProperty.call(source, key)) {
            target[key] = source[key];
          }
        }
      }
      return target;
    };
  return _extends.apply(this, arguments);
}

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

/**
 * A constrained version of Cascader that builds up a key-value object instead
 * of a list of strings as its output. This is done by serializing the option
 * values as URL query strings and delegating the rest of the functionality
 *
 * See also: https://ant.design/components/cascader/
 *
 * NOTE: This component is a minimal implementation for a specific use-case. It
 * can be extended, but currently only explicitly supports the `options` and
 * `onChange` props, and only supports setting `value` to the empty array.
 */
class URLParamsCascader extends React.Component {
  constructor() {
    super(...arguments);

    _defineProperty(this, "_handleChange", selection => {
      if (!this.props.onChange) {
        return;
      }

      const params = {};

      for (const _ref of new URLSearchParams(selection.join("&"))) {
        var _ref2 = _slicedToArray(_ref, 2);

        const key = _ref2[0];
        const value = _ref2[1];
        params[key] = value;
      }

      this.props.onChange(params);
    });
  }

  _mapOptions(options) {
    if (!options) {
      return undefined;
    }

    return options.map(option =>
      _objectSpread({}, option, {
        value: new URLSearchParams(option.value || {}).toString(),
        children: this._mapOptions(option.children)
      })
    );
  }

  render() {
    const _this$props = this.props,
      options = _this$props.options,
      _defaultValue = _this$props.defaultValue,
      cascaderProps = _objectWithoutProperties(_this$props, [
        "options",
        "defaultValue"
      ]);

    return React.createElement(
      _antd.Cascader,
      _extends({}, cascaderProps, {
        options: this._mapOptions(options),
        onChange: this._handleChange
      })
    );
  }
}

module.exports = URLParamsCascader;
