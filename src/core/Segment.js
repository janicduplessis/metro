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

var _Symbol$iterator = Symbol.iterator;

// prettier-ignore
class Segment {
  constructor() {
    let modules = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

    _defineProperty(this, "_modules", new Map());

    for (const module of modules) {
      this.addModule(module);
    }
  }
  /*:: @@iterator: () => Iterator<Module<T>>; */
  // eslint-disable-next-line lint/flow-no-fixme
  // $FlowFixMe: Flow does not have support for computed properties.


  [_Symbol$iterator]() {
    return this._modules.values();
  }

  forEach(callback) {
    return this._modules.forEach(module => {
      callback(module);
    });
  }

  map(callback) {
    const result = [];
    this.forEach(module => {
      result.push(callback(module));
    });
    return result;
  }

  filter(callback) {
    const result = new Segment();
    this.forEach(module => {
      if (callback(module)) {
        result.addModule(module);
      }
    });
    return result;
  }

  hasModule(module) {
    return this._modules.has(module.getModulePath());
  }

  getModule() {
    throw new TypeError('Getting modules can only be done via "getModuleByPath"');
  }

  addModule(module) {
    if (this.hasModule(module)) {
      throw new ReferenceError('Module already exists');
    }

    this._modules.set(module.getModulePath(), module);

    return this;
  }

  deleteModule(module) {
    if (!this.hasModule(module)) {
      throw new ReferenceError('Module not found');
    }

    this._modules.delete(module.getModulePath());

    return this;
  }

  hasModuleByPath(modulePath) {
    return this._modules.has(modulePath);
  }

  getModuleByPath(modulePath) {
    const module = this._modules.get(modulePath);

    if (!module) {
      throw new ReferenceError('Module not found');
    }

    return module;
  }

  addModuleByPath() {
    throw new TypeError('Adding modules can only be done via "addModule"');
  }

  deleteModuleByPath(modulePath) {
    if (!this._modules.has(modulePath)) {
      throw new ReferenceError('Module not found');
    }

    this._modules.delete(modulePath);

    return this;
  }

  joinSegment(segment) {
    const result = new Segment(this);
    segment.forEach(module => {
      if (!result.hasModule(module)) {
        result.addModule(module);
      }
    });
    return result;
  }

  subtractSegment(segment) {
    const result = new Segment();

    this._modules.forEach(module => {
      if (!segment.hasModule(module)) {
        result.addModule(module);
      }
    });

    return result;
  }

  intersectSegment(segment) {
    const result = new Segment();

    this._modules.forEach(module => {
      if (segment.hasModule(module)) {
        result.addModule(module);
      }
    });

    return result;
  }

  diffSegment(original) {
    return {
      added: original.subtractSegment(this),
      deleted: this.subtractSegment(original)
    };
  }

}

module.exports = Segment;
