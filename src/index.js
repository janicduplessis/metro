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

const _require = require("./middleware/metroHistory"),
  metroHistory = _require.metroHistory,
  startRecordingHistory = _require.startRecordingHistory;

const _require2 = require("./middleware/routes"),
  initializeMiddlewareRoutes = _require2.initializeMiddlewareRoutes;

function initializeVisualizerMiddleware(metroServer) {
  startRecordingHistory(metroServer._logger);
  return initializeMiddlewareRoutes(metroServer, metroHistory);
}

module.exports = {
  initializeVisualizerMiddleware
};
