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

const fs = require("fs");

const metro = require("metro");

const _require = require("./graph-api/routes"),
  initializeGraphRoutes = _require.initializeGraphRoutes;

const _require2 = require("metro-core"),
  Terminal = _require2.Terminal;

const _require3 = require("url"),
  parse = _require3.parse;

const router = Router();
const terminal = new Terminal(process.stdout);
let metroServer;
let metroHistory;

function initializeMiddlewareRoutes(server, history) {
  metroServer = server;
  metroHistory = history;
  return router;
}

router.get("/", (req, res) => {
  const status = "Launching visualizer";
  terminal.status(status);
  res.writeHead(200, {
    "Content-Type": "text/html"
  });
  res.write(
    fs.readFileSync(require.resolve("metro-visualizer/src/app/index.html"))
  );
  res.end();
  terminal.status(`${status}, done.`);
  terminal.persistStatus();
});
router.use(function query(req, res, next) {
  req.query = req.url.includes("?") ? parse(req.url, true).query : {};
  next();
});
router.use("/", (err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send(err.message);
  next();
});
router.use(
  "/graph",
  /*#__PURE__*/
  (function() {
    var _ref = _asyncToGenerator(function*(req, res, next) {
      yield getGraph(req.query.hash)
        .then(metroGraph => initializeGraphRoutes(metroGraph)(req, res, next))
        .catch(error => {
          res.writeHead(500, {
            "Content-Type": "text/plain"
          });
          res.write((error && error.stack) || error);
          res.end();
        });
    });

    return function(_x, _x2, _x3) {
      return _ref.apply(this, arguments);
    };
  })()
);
router.get(
  "/bundles",
  /*#__PURE__*/
  (function() {
    var _ref2 = _asyncToGenerator(function*(req, res) {
      res.setHeader("Content-Type", "application/json; charset=utf-8");
      res.write(JSON.stringify(metroHistory));
      res.end();
    });

    return function(_x4, _x5) {
      return _ref2.apply(this, arguments);
    };
  })()
);
router.get(
  "/platforms",
  /*#__PURE__*/
  (function() {
    var _ref3 = _asyncToGenerator(function*(req, res) {
      res.setHeader("Content-Type", "application/json; charset=utf-8");
      res.write(JSON.stringify(metroServer.getPlatforms()));
      res.end();
    });

    return function(_x6, _x7) {
      return _ref3.apply(this, arguments);
    };
  })()
);
router.use(
  "/bundle.js",
  /*#__PURE__*/
  (function() {
    var _ref4 = _asyncToGenerator(function*(req, res, next) {
      const status = "Bundling visualizer app";
      const options = {
        dev: true,
        entry: "./src/app/index.js",
        minify: false,
        platform: "web"
      };
      const config = yield metro.loadConfig({
        config: require.resolve("./build-utils/metro.config.js")
      });
      yield metro
        .runBuild(config, options)
        .then(val => {
          terminal.status(`${status}... serving`);
          res.writeHead(200, {
            "Content-Type": "text/javascript"
          });
          res.write(val.code);
          res.end();
          terminal.status(`${status}, done.`);
          terminal.persistStatus();
        })
        .catch(error => {
          terminal.log(error);
          terminal.status(`${status}, failed.`);
          terminal.persistStatus();
        });
    });

    return function(_x8, _x9, _x10) {
      return _ref4.apply(this, arguments);
    };
  })()
);
router.get(
  "/config",
  /*#__PURE__*/
  (function() {
    var _ref5 = _asyncToGenerator(function*(req, res) {
      res.setHeader("Content-Type", "application/json; charset=utf-8");
      res.write(JSON.stringify(metroServer.getVisualizerConfig()));
      res.end();
    });

    return function(_x11, _x12) {
      return _ref5.apply(this, arguments);
    };
  })()
);

function getGraph(_x13) {
  return _getGraph.apply(this, arguments);
}

function _getGraph() {
  _getGraph = _asyncToGenerator(function*(graphId) {
    const status = "Getting last bundle's graph";
    terminal.status(`${status}... fetching from Metro`);
    const graph = metroServer.getBundler().getRevisionByGraphId(graphId);

    if (graph == null) {
      terminal.status(`${status}, failed.`);
      terminal.persistStatus();
      throw new Error("A graph with the given hash was not found");
    }

    terminal.status(`${status}, done.`);
    return graph.then(graphRevision => graphRevision.graph);
  });
  return _getGraph.apply(this, arguments);
}

module.exports = {
  initializeMiddlewareRoutes
};
