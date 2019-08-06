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

const WebSocketHMRClient = require("./WebSocketHMRClient");

const injectUpdate = require("./injectUpdate");

class HMRClient extends WebSocketHMRClient {
  constructor(url) {
    super(url);

    _defineProperty(this, "_isEnabled", false);

    _defineProperty(this, "_pendingUpdate", null);

    this.on("update", update => {
      if (this._isEnabled) {
        injectUpdate(update);
      } else if (this._pendingUpdate == null) {
        this._pendingUpdate = update;
      } else {
        this._pendingUpdate = mergeUpdates(this._pendingUpdate, update);
      }
    });
  }

  enable() {
    this._isEnabled = true;
    const update = this._pendingUpdate;
    this._pendingUpdate = null;

    if (update != null) {
      injectUpdate(update);
    }
  }

  disable() {
    this._isEnabled = false;
  }

  isEnabled() {
    return this._isEnabled;
  }

  hasPendingUpdates() {
    return this._pendingUpdate != null;
  }
}

function mergeUpdates(base, next) {
  const addedIDs = new Set();
  const deletedIDs = new Set();
  const moduleMap = new Map();
  const sourceMappingURLs = new Map();
  const sourceURLs = new Map(); // Fill in the temporary maps and sets from both updates in their order.

  applyUpdateLocally(base);
  applyUpdateLocally(next);

  function applyUpdateLocally(update) {
    update.deleted.forEach(id => {
      if (addedIDs.has(id)) {
        addedIDs.delete(id);
      } else {
        deletedIDs.add(id);
      }

      moduleMap.delete(id);
    });
    update.added.forEach((_ref, index) => {
      let _ref2 = _slicedToArray(_ref, 2),
        id = _ref2[0],
        source = _ref2[1];

      if (deletedIDs.has(id)) {
        deletedIDs.delete(id);
      } else {
        addedIDs.add(id);
      }

      moduleMap.set(id, source);
      sourceMappingURLs.set(id, update.addedSourceMappingURLs[index]);
      sourceURLs.set(id, update.addedSourceURLs[index]);
    });
    update.modified.forEach((_ref3, index) => {
      let _ref4 = _slicedToArray(_ref3, 2),
        id = _ref4[0],
        source = _ref4[1];

      moduleMap.set(id, source);
      sourceMappingURLs.set(id, update.modifiedSourceMappingURLs[index]);
      sourceURLs.set(id, update.modifiedSourceURLs[index]);
    });
  } // Now reconstruct a unified update from our in-memory maps and sets.
  // Applying it should be equivalent to applying both of them individually.

  const result = {
    isInitialUpdate: next.isInitialUpdate,
    revisionId: next.revisionId,
    added: [],
    addedSourceMappingURLs: [],
    addedSourceURLs: [],
    modified: [],
    modifiedSourceMappingURLs: [],
    modifiedSourceURLs: [],
    deleted: []
  };
  deletedIDs.forEach(id => {
    result.deleted.push(id);
  });
  moduleMap.forEach((source, id) => {
    if (deletedIDs.has(id)) {
      return;
    }

    const sourceURL = sourceURLs.get(id);
    const sourceMappingURL = sourceMappingURLs.get(id);

    if (typeof sourceURL !== "string") {
      throw new Error("[HMRClient] Expected to find a sourceURL in the map.");
    }

    if (typeof sourceMappingURL !== "string") {
      throw new Error("[HMRClient] Expected to find a sourceURL in the map.");
    }

    if (addedIDs.has(id)) {
      result.added.push([id, source]);
      result.addedSourceMappingURLs.push(sourceMappingURL);
      result.addedSourceURLs.push(sourceURL);
    } else {
      result.modified.push([id, source]);
      result.modifiedSourceMappingURLs.push(sourceMappingURL);
      result.modifiedSourceURLs.push(sourceURL);
    }
  });
  return result;
}

module.exports = HMRClient;
