/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 *  strict-local
 * @format
 */

/* eslint-env browser */
"use strict";

const DashboardApp = require("./dashboard/DashboardApp");

const GraphApp = require("./graph/GraphApp");

const React = require("react");

const ReactDOM = require("react-dom");

const nullthrows = require("nullthrows"); // flowlint-next-line untyped-import:off

const _require = require("react-router-dom"),
  HashRouter = _require.HashRouter,
  Route = _require.Route;

ReactDOM.render(
  React.createElement(
    HashRouter,
    null,
    React.createElement(
      "div",
      null,
      React.createElement(Route, {
        exact: true,
        path: "/",
        component: DashboardApp
      }),
      React.createElement(Route, {
        path: "/graph/(.*)",
        component: GraphApp
      })
    )
  ),
  nullthrows(document.getElementById("root"))
);
