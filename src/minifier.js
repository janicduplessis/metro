/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 *
 * @format
 */
"use strict";

function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);
  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    if (enumerableOnly)
      symbols = symbols.filter(function(sym) {
        return Object.getOwnPropertyDescriptor(object, sym).enumerable;
      });
    keys.push.apply(keys, symbols);
  }
  return keys;
}

function _objectSpread(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};
    if (i % 2) {
      ownKeys(Object(source), true).forEach(function(key) {
        _defineProperty(target, key, source[key]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
      ownKeys(Object(source)).forEach(function(key) {
        Object.defineProperty(
          target,
          key,
          Object.getOwnPropertyDescriptor(source, key)
        );
      });
    }
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

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
  try {
    var info = gen[key](arg);
    var value = info.value;
  } catch (error) {
    reject(error);
    return;
  }
  if (info.done) {
    resolve(value);
  } else {
    Promise.resolve(value).then(_next, _throw);
  }
}

function _asyncToGenerator(fn) {
  return function() {
    var self = this,
      args = arguments;
    return new Promise(function(resolve, reject) {
      var gen = fn.apply(self, args);
      function _next(value) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
      }
      function _throw(err) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
      }
      _next(undefined);
    });
  };
}

const terser = require("terser");

function minifier(_x) {
  return _minifier.apply(this, arguments);
}

function _minifier() {
  _minifier = _asyncToGenerator(function*(options) {
    const result = yield minify(options);

    if (!options.map || result.map == null) {
      return {
        code: result.code
      };
    }

    const map = JSON.parse(result.map);
    return {
      code: result.code,
      map: _objectSpread(
        _objectSpread({}, map),
        {},
        {
          sources: [options.filename]
        }
      )
    };
  });
  return _minifier.apply(this, arguments);
}

function minify(_x2) {
  return _minify.apply(this, arguments);
}

function _minify() {
  _minify = _asyncToGenerator(function*(_ref) {
    let code = _ref.code,
      map = _ref.map,
      reserved = _ref.reserved,
      config = _ref.config;

    const options = _objectSpread(
      _objectSpread({}, config),
      {},
      {
        mangle: _objectSpread(
          _objectSpread({}, config.mangle),
          {},
          {
            reserved
          }
        ),
        sourceMap: map
          ? _objectSpread(
              _objectSpread({}, config.sourceMap),
              {},
              {
                content: map
              }
            )
          : false
      }
    );
    /* $FlowFixMe(>=0.111.0 site=react_native_fb) This comment suppresses an
     * error found when Flow v0.111 was deployed. To see the error, delete this
     * comment and run Flow. */

    const result = yield terser.minify(code, options);
    return {
      code: result.code,
      map: result.map
    };
  });
  return _minify.apply(this, arguments);
}

module.exports = minifier;
