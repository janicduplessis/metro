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

const _require = require("metro-core"),
  Logger = _require.Logger;

const metroHistory = {};

function startRecordingHistory(logger) {
  logger.on("log", logEntry => {
    if (
      logEntry.bundle_hash == null ||
      logEntry.build_id == null ||
      logEntry.bundle_options == null
    ) {
      return;
    }

    if (
      logEntry.action_name === "Requesting bundle" &&
      logEntry.action_phase === "start"
    ) {
      recordToHistory(
        logEntry.bundle_hash,
        logEntry.bundle_options,
        logEntry.build_id,
        {
          status: "started",
          startTime: logEntry.start_timestamp
        }
      );
    }

    if (
      logEntry.action_name === "Requesting bundle" &&
      logEntry.action_phase === "end"
    ) {
      recordToHistory(
        logEntry.bundle_hash,
        logEntry.bundle_options,
        logEntry.build_id,
        {
          status: "done",
          duration: logEntry.duration_ms,
          numModifiedFiles: logEntry.outdated_modules,
          bundleSize: logEntry.bundle_size
        }
      );
    }

    if (logEntry.action_name === "bundling_error") {
      recordToHistory(
        logEntry.bundle_hash,
        logEntry.bundle_options,
        logEntry.build_id,
        {
          status: "failed",
          duration: logEntry.duration_ms
        }
      );
    }
  });
}

function recordToHistory(bundleHash, options, buildID, buildInfo) {
  const hist = metroHistory[bundleHash];

  if (hist != null) {
    const buildHist = hist.builds[buildID];

    if (buildHist != null) {
      hist.builds[buildID] = Object.assign(buildHist, buildInfo);
    } else {
      hist.builds[buildID] = buildInfo;
    }
  } else {
    metroHistory[bundleHash] = {
      options,
      builds: {
        [buildID]: Object.assign(buildInfo, {
          isInitial: true
        })
      }
    };
  }
}

module.exports = {
  metroHistory,
  startRecordingHistory
};
