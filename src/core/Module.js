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

const Segment = require("./Segment");

module.exports = class Module {
  constructor(modulePath) {
    _defineProperty(this, "_dependencies", new Set());

    _defineProperty(this, "_inverseDependencies", new Set());

    _defineProperty(this, "_output", null);

    this._modulePath = modulePath;
  }

  getModulePath() {
    return this._modulePath;
  }

  addDependency(module) {
    const dependencies = this._dependencies;

    if (dependencies.has(module)) {
      return;
    }

    dependencies.add(module);
    module.addInverseDependency(module);
  }

  addInverseDependency(module) {
    const inverseDependencies = this._inverseDependencies;

    if (inverseDependencies.has(module)) {
      return;
    }

    inverseDependencies.add(module);
    module.addDependency(this);
  }

  deleteDependency(module) {
    const dependencies = this._dependencies;

    if (!dependencies.has(module)) {
      return;
    }

    dependencies.delete(module);
    module.deleteInverseDependency(this);
  }

  deleteInverseDependency(module) {
    const inverseDependencies = this._inverseDependencies;

    if (inverseDependencies.has(module)) {
      return;
    }

    inverseDependencies.delete(module);
    module.deleteDependency(this);
  }

  getDependencies() {
    return new Segment(this._dependencies);
  }

  getTransitiveDependencies() {
    const transitiveDependencies = new Segment();
    const stack = [this];

    while (stack.length > 0) {
      const dependency = stack.pop();

      if (!transitiveDependencies.hasModule(dependency)) {
        const dependencies = Array.from(dependency.getDependencies());

        for (let i = dependencies.length - 1; i >= 0; i--) {
          stack.push(dependencies[i]);
        }

        transitiveDependencies.addModule(dependency);
      }
    } // A module is not a dependency of itself.

    return transitiveDependencies.deleteModule(this);
  }

  getInverseDependencies() {
    return new Segment(this._inverseDependencies);
  }

  asSegment() {
    return new Segment([this]);
  }

  getOutput() {
    const output = this._output;

    if (output == null) {
      throw new ReferenceError("Module did not have an output assigned");
    }

    return output;
  }

  setOutput(output) {
    this._output = output;
  }
};
