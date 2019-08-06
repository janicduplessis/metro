/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 *  strict-local
 * @format
 */
"use strict";

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

const Module = require("./Module");

const Segment = require("./Segment");

class Graph extends Segment {
  constructor() {
    super(...arguments);

    _defineProperty(this, "_entryPoints", new Segment());
  }

  getEntryPoints() {
    return new Segment(this._entryPoints);
  }

  hasEntryPoint(entryPoint) {
    return this._entryPoints.hasModule(entryPoint);
  }

  addEntryPoint(entryPoint) {
    this._entryPoints.addModule(entryPoint);

    return this;
  }

  deleteEntryPoint(entryPoint) {
    this._entryPoints.deleteModule(entryPoint);

    return this;
  }

  hasEntryPointByPath(entryPointPath) {
    return this._entryPoints.hasModuleByPath(entryPointPath);
  }

  addEntryPointByPath() {
    throw new TypeError(
      'Adding entry points can only be done via "addEntryPoint"'
    );
  }

  deleteEntryPointByPath(entryPointPath) {
    this._entryPoints.deleteModuleByPath(entryPointPath);

    return this;
  }
}

module.exports = Graph;
