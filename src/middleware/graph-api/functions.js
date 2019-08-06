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

const path = require("path");

class PathSearchError extends Error {}

function getModule(metroGraph, modulePath) {
  const module = metroGraph.dependencies.get(modulePath);

  if (module == null) {
    throw new Error(`Module not found for path: ${modulePath}`);
  }

  return module;
}

function getGraphToModule(metroGraph, modulePath) {
  const nodes = new Set();
  const edges = [];
  const module = getModule(metroGraph, modulePath);
  nodes.add(moduleToNode(module, metroGraph));

  for (const parentPath of module.inverseDependencies) {
    const parentModule = getModule(metroGraph, parentPath);
    const dep = parentModule.dependencies.get(path.basename(modulePath, ".js"));
    nodes.add(moduleToNode(parentModule, metroGraph));
    edges.push(
      createEdge(parentPath, modulePath, dep ? dep.data.data.isAsync : false)
    );
  }

  return {
    nodes: _toConsumableArray(nodes),
    edges
  };
}

function getGraphFromModule(metroGraph, modulePath) {
  let inverse =
    arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
  const nodes = new Set();
  const edges = [];
  const module = getModule(metroGraph, modulePath);
  nodes.add(moduleToNode(module, metroGraph));

  for (const dep of module.dependencies.values()) {
    const depModule = getModule(metroGraph, dep.absolutePath);
    nodes.add(moduleToNode(depModule, metroGraph));
    edges.push(createEdge(modulePath, dep.absolutePath, dep.data.data.isAsync));
  }

  return {
    nodes: _toConsumableArray(nodes),
    edges
  };
}

function getGraphFromModuleToModule(metroGraph, origin, target) {
  let resultGraph = {
    nodes: new Map(),
    edges: []
  };
  let prevError = false;
  let inverse = false;

  while (true) {
    try {
      _buildGraphFromModuleToModule(
        metroGraph,
        origin,
        target,
        resultGraph,
        inverse
      );

      break;
    } catch (e) {
      if (
        prevError ||
        !(e instanceof PathSearchError || e instanceof RangeError)
      ) {
        throw e;
      }

      prevError = true;
      resultGraph = {
        nodes: new Map(),
        edges: []
      };
      inverse = true;
    }
  }

  return {
    nodes: _toConsumableArray(resultGraph.nodes.values()),
    edges: resultGraph.edges
  };
}

function _addPathToGraph(graphPath, graph, metroGraph, inverse) {
  const p = inverse
    ? _toConsumableArray(graphPath).reverse()
    : _toConsumableArray(graphPath);

  for (var i = 0; i < graphPath.size - 1; i++) {
    const mod = getModule(metroGraph, p[i]);
    const dep = mod.dependencies.get(p[i + 1]);
    graph.nodes.set(p[i], moduleToNode(mod, metroGraph));
    graph.edges.push(
      createEdge(p[i], p[i + 1], dep ? dep.data.data.isAsync : false)
    );
  }

  if (!graph.nodes.has(p[p.length - 1])) {
    graph.nodes.set(
      p[p.length - 1],
      moduleToNode(getModule(metroGraph, p[p.length - 1]), metroGraph)
    );
  }
}

function _buildGraphFromModuleToModule(
  metroGraph,
  origin,
  target,
  resultGraph
) {
  let inverse =
    arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false;
  let currentPath =
    arguments.length > 5 && arguments[5] !== undefined
      ? arguments[5]
      : new Set();
  let maxDepth =
    arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : 200;
  let maxDegree =
    arguments.length > 7 && arguments[7] !== undefined ? arguments[7] : 100;
  const nextNode = inverse ? target : origin;

  if (currentPath.has(nextNode) || currentPath.size > maxDepth) {
    // Prevent cycles and stack overflows
    return;
  }

  currentPath.add(nextNode);

  if (origin === target) {
    _addPathToGraph(currentPath, resultGraph, metroGraph, inverse);

    return;
  }

  if (resultGraph.nodes.has(nextNode)) {
    _addPathToGraph(currentPath, resultGraph, metroGraph, inverse);

    return;
  }

  const deps = inverse
    ? _toConsumableArray(
        getModule(metroGraph, target).inverseDependencies.values()
      )
    : _toConsumableArray(
        getModule(metroGraph, origin).dependencies.values()
      ).map(d => d.absolutePath);

  if (deps.length > maxDegree && !inverse) {
    // A custom error is thrown to signal that it might be faster to perfom
    // the algorithm inversely
    throw new PathSearchError();
  }

  for (const dep of deps) {
    _buildGraphFromModuleToModule(
      metroGraph,
      inverse ? origin : dep,
      inverse ? dep : target,
      resultGraph,
      inverse,
      new Set(currentPath),
      maxDepth,
      maxDegree
    );
  }
}

function getGraphInfo(metroGraph) {
  const modules = [];
  const depTypes = new Set();
  let maxIncomingEdges = 0;
  let maxOutgoingEdges = 0;

  for (const _ref of metroGraph.dependencies.entries()) {
    var _ref2 = _slicedToArray(_ref, 2);

    const modulePath = _ref2[0];
    const module = _ref2[1];
    maxOutgoingEdges = Math.max(module.dependencies.size, maxOutgoingEdges);
    maxIncomingEdges = Math.max(
      module.inverseDependencies.size,
      maxIncomingEdges
    );
    depTypes.add(module.output[0].type);
    modules.push({
      name: path.basename(modulePath, ".js"),
      filePath: modulePath
    });
  }

  return {
    modules,
    info: {
      maxIncomingEdges,
      maxOutgoingEdges,
      dependencyTypes: _toConsumableArray(depTypes)
    }
  };
}

function getModuleSize(module) {
  // $FlowFixMe
  const code = module.output[0].data.code;
  return code ? code.length : 0;
}

function generateSizeAccumulator(metroGraph) {
  return (total, currentPath) =>
    total + getModuleSize(getModule(metroGraph, currentPath));
}

function moduleToNode(module, metroGraph) {
  const deps = _toConsumableArray(module.dependencies.values()).map(
    d => d.absolutePath
  );

  const inverseDeps = _toConsumableArray(module.inverseDependencies);

  return {
    data: {
      id: module.path,
      label: path.basename(module.path, ".js"),
      deps,
      inverseDeps,
      size: getModuleSize(module),
      depsSize: deps.reduce(generateSizeAccumulator(metroGraph), 0),
      invDepsSize: inverseDeps.reduce(generateSizeAccumulator(metroGraph), 0),
      type: module.output[0].type,
      // $FlowFixMe
      output: module.output[0].data.code,
      // Converting to base64 here avoids having to bundle an extra base64
      // implementation for the browser.
      source: module.getSource().toString("base64")
    }
  };
}

function createEdge(from, to, isAsync) {
  return {
    data: {
      isAsync,
      id: `${from}-${to}`,
      source: from,
      target: to
    }
  };
}

module.exports = {
  getGraphFromModule,
  getGraphToModule,
  getGraphFromModuleToModule,
  getGraphInfo,
  _addPathToGraph,
  _buildGraphFromModuleToModule
};
