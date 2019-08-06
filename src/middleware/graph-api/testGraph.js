/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 *  strict-local
 * @format
 * @emails  oncall+metro_bundler
 */
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

const dummyModule = {
  dependencies: new Map(),
  inverseDependencies: new Set(),
  output: [
    {
      type: "js/module",
      data: {
        code: "0123456789"
      }
    }
  ],
  path: "",
  getSource: () => Buffer.from("")
};
const dummyMetroGraph = {
  dependencies: new Map([
    [
      "path/to/liverpool-street.js",
      _objectSpread({}, dummyModule, {
        path: "path/to/liverpool-street.js",
        dependencies: new Map([
          [
            "bank",
            {
              absolutePath: "path/to/bank.js",
              data: {
                name: "bank",
                data: {
                  isAsync: true
                }
              }
            }
          ],
          [
            "moorgate",
            {
              absolutePath: "path/to/moorgate.js",
              data: {
                name: "moorgate",
                data: {
                  isAsync: false
                }
              }
            }
          ]
        ])
      })
    ],
    [
      "path/to/moorgate.js",
      _objectSpread({}, dummyModule, {
        path: "path/to/moorgate.js",
        dependencies: new Map([
          [
            "st-paul",
            {
              absolutePath: "path/to/st-paul.js",
              data: {
                name: "st-paul",
                data: {
                  isAsync: true
                }
              }
            }
          ]
        ]),
        inverseDependencies: new Set(["path/to/liverpool-street.js"])
      })
    ],
    [
      "path/to/bank.js",
      _objectSpread({}, dummyModule, {
        path: "path/to/bank.js",
        dependencies: new Map([
          [
            "st-paul",
            {
              absolutePath: "path/to/st-paul.js",
              data: {
                name: "st-paul",
                data: {
                  isAsync: false
                }
              }
            }
          ]
        ]),
        inverseDependencies: new Set(["path/to/liverpool-street.js"])
      })
    ],
    [
      "path/to/st-paul.js",
      _objectSpread({}, dummyModule, {
        path: "path/to/st-paul.js",
        dependencies: new Map([
          [
            "chancery-lane",
            {
              absolutePath: "path/to/chancery-lane.js",
              data: {
                name: "chancery-lane",
                data: {
                  isAsync: false
                }
              }
            }
          ]
        ]),
        inverseDependencies: new Set(["path/to/bank.js", "path/to/moorgate.js"])
      })
    ],
    [
      "path/to/chancery-lane.js",
      _objectSpread({}, dummyModule, {
        path: "path/to/chancery-lane.js",
        dependencies: new Map([
          [
            "holborn",
            {
              absolutePath: "path/to/holborn.js",
              data: {
                name: "holborn",
                data: {
                  isAsync: false
                }
              }
            }
          ]
        ]),
        inverseDependencies: new Set(["path/to/st-paul.js"])
      })
    ],
    [
      "path/to/holborn.js",
      _objectSpread({}, dummyModule, {
        path: "path/to/holborn.js",
        dependencies: new Map([
          [
            "tottenham-court-road",
            {
              absolutePath: "path/to/tottenham-court-road.js",
              data: {
                name: "tottenham-court-road",
                data: {
                  isAsync: false
                }
              }
            }
          ]
        ]),
        inverseDependencies: new Set(["path/to/chancery-lane.js"])
      })
    ],
    [
      "path/to/leicester-square.js",
      _objectSpread({}, dummyModule, {
        path: "path/to/leicester-square.js",
        inverseDependencies: new Set(["path/to/holborn.js"])
      })
    ],
    [
      "path/to/tottenham-court-road.js",
      _objectSpread({}, dummyModule, {
        path: "path/to/tottenham-court-road.js",
        inverseDependencies: new Set(["path/to/holborn.js"])
      })
    ]
  ]),
  entryPoints: ["foo"],
  importBundleNames: new Set()
};
module.exports = dummyMetroGraph;
