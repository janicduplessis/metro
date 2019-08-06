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

const Router = require("router");

const _require = require("./functions"),
  getGraphFromModule = _require.getGraphFromModule,
  getGraphToModule = _require.getGraphToModule,
  getGraphInfo = _require.getGraphInfo,
  getGraphFromModuleToModule = _require.getGraphFromModuleToModule;

const router = Router();
let metroGraph;

function initializeGraphRoutes(graph) {
  metroGraph = graph;
  return router;
}
/*
 * Get the whole dependency graph in a cytoscape format
 *
 * @response {CyGraph}
 */

router.get(
  "/",
  /*#__PURE__*/
  (function() {
    var _ref = _asyncToGenerator(function*(req, res) {
      res.status(500).send("Unimplemented");
    });

    return function(_x, _x2) {
      return _ref.apply(this, arguments);
    };
  })()
);
/*
 * Get basic information about the graph, including a list of all the modules
 * in the graph
 *
 * @response {Object} info
 * @response {String} info.entryPoints
 * @response {String} info.edgeCount
 * @response {String} info.nodeCount
 */

router.get("/info", function(req, res) {
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.write(JSON.stringify(getGraphInfo(metroGraph)));
  res.end();
});
/*
 * Get the cytoscape formatted dependency graph using a specific module as the
 * root.
 *
 * @params [:path] Path to the module to be used as root
 *
 * TODO @query {number} [depth = 0] How many levels to recursively expand dependencies
 * TODO @query {string} [segment] Filters expanded dependencies by segment
 * TODO @query {string} [directory] Filters expanded dependencies by directory
 *
 * @response {CyGraph}
 */

router.get("/modules/:path(*)", function(req, res) {
  res.setHeader("Content-Type", "application/json; charset=utf-8");

  if (req.query.inverse) {
    res.write(JSON.stringify(getGraphToModule(metroGraph, req.params.path)));
  } else if (req.query.to) {
    res.write(
      JSON.stringify(
        getGraphFromModuleToModule(metroGraph, req.params.path, req.query.to)
      )
    );
  } else {
    res.write(JSON.stringify(getGraphFromModule(metroGraph, req.params.path)));
  }

  res.end();
});
/*
 * Get a list of all the directories in the graph
 *
 * @response {Array<string>}
 */

router.get("/directories", function(req, res) {
  res.status(500).send("Unimplemented");
});
/*
 * Get the cytoscape formatted dependency graph of all the modules within
 * a specific directory
 *
 * @params :path Path to the directory
 *
 * @response {CyGraph}
 */

router.get("/directories/:path(*)", function(req, res) {
  res.status(500).send("Unimplemented");
});
module.exports = {
  initializeGraphRoutes
};
