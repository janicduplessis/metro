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

function _toArray(arr) {
  return _arrayWithHoles(arr) || _iterableToArray(arr) || _nonIterableRest();
}

function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance");
}

function _iterableToArray(iter) {
  if (
    Symbol.iterator in Object(iter) ||
    Object.prototype.toString.call(iter) === "[object Arguments]"
  )
    return Array.from(iter);
}

function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}

function _objectWithoutProperties(source, excluded) {
  if (source == null) return {};
  var target = _objectWithoutPropertiesLoose(source, excluded);
  var key, i;
  if (Object.getOwnPropertySymbols) {
    var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
    for (i = 0; i < sourceSymbolKeys.length; i++) {
      key = sourceSymbolKeys[i];
      if (excluded.indexOf(key) >= 0) continue;
      if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
      target[key] = source[key];
    }
  }
  return target;
}

function _objectWithoutPropertiesLoose(source, excluded) {
  if (source == null) return {};
  var target = {};
  var sourceKeys = Object.keys(source);
  var key, i;
  for (i = 0; i < sourceKeys.length; i++) {
    key = sourceKeys[i];
    if (excluded.indexOf(key) >= 0) continue;
    target[key] = source[key];
  }
  return target;
}

const JSONStream = require("JSONStream");

const duplexer = require("duplexer");

const each = require("async/each");

const fs = require("fs");

const invariant = require("invariant");

const _require = require("console"),
  Console = _require.Console;

function buckWorker(commands) {
  const reader = JSONStream.parse("*");
  const writer = JSONStream.stringify();

  function handleHandshake(message) {
    const response = handshakeResponse(message);
    writer.write(response);

    if (response.type === "handshake") {
      reader.removeListener("data", handleHandshake).on("data", handleCommand);
    }
  }

  function handleCommand(message) {
    const id = message.id;

    if (message.type !== "command") {
      writer.write(unknownMessage(id));
      return;
    }

    if (!message.args_path || !message.stdout_path || !message.stderr_path) {
      writer.write(invalidMessage(id));
      return;
    }

    let responded = false;
    let stdout, stderr;

    try {
      stdout = fs.createWriteStream(message.stdout_path);
      stderr = fs.createWriteStream(message.stderr_path);
    } catch (e) {
      respond(invalidMessage(id));
      return;
    }

    readArgsAndExecCommand(message, commands, stdout, stderr, respond);

    function respond(response) {
      // 'used for lazy `.stack` access'
      invariant(!responded, `Already responded to message id ${id}.`);
      responded = true;
      each(
        [stdout, stderr].filter(Boolean),
        (stream, cb) => stream.end(cb),
        error => {
          if (error) {
            throw error;
          }

          writer.write(response);
        }
      );
    }
  }

  reader.on("data", handleHandshake).on("end", () => writer.end());
  return duplexer(reader, writer);
}

function handshakeResponse(message) {
  if (message.type !== "handshake") {
    return unknownMessage(message.id);
  }

  if (message.protocol_version !== "0") {
    return invalidMessage(message.id);
  }

  return {
    id: message.id,
    type: "handshake",
    protocol_version: "0",
    capabilities: []
  };
}

function readArgsAndExecCommand(message, commands, stdout, stderr, respond) {
  const id = message.id;
  fs.readFile(message.args_path, "utf8", (readError, argsString) => {
    if (readError) {
      respond(invalidMessage(id));
      return;
    }

    let commandName;
    let args = [];
    let structuredArgs = null; // If it starts with a left brace, we assume it's JSON-encoded. This works
    // because the non-JSON encoding always starts the string with the
    // command name, thus a letter.

    if (argsString[0] === "{") {
      var _JSON$parse = JSON.parse(argsString);

      commandName = _JSON$parse.command;
      structuredArgs = _objectWithoutProperties(_JSON$parse, ["command"]);
      _JSON$parse;
    } else {
      // FIXME: if there are files names with escaped
      // whitespace, this will not work.
      var _argsString$split = argsString.split(/\s+/);

      var _argsString$split2 = _toArray(_argsString$split);

      commandName = _argsString$split2[0];
      args = _argsString$split2.slice(1);
    }

    if (commands.hasOwnProperty(commandName)) {
      const command = commands[commandName];
      const commandSpecificConsole = new Console(stdout, stderr);
      execCommand(
        command,
        commandName,
        argsString,
        args,
        structuredArgs,
        commandSpecificConsole,
        respond,
        id
      );
    } else {
      stderr.write(
        `This worker does not have a command named \`${commandName}\`. ` +
          `Available commands are: ${Object.keys(commands).join(", ")}`
      );
      respond(invalidMessage(id));
    }
  });
}

const JS_WORKER_TOOL_DEBUG_RE = process.env.JS_WORKER_TOOL_DEBUG_RE;
const DEBUG_RE = JS_WORKER_TOOL_DEBUG_RE
  ? new RegExp(JS_WORKER_TOOL_DEBUG_RE)
  : null;

function execCommand(_x, _x2, _x3, _x4, _x5, _x6, _x7, _x8) {
  return _execCommand.apply(this, arguments);
}

function _execCommand() {
  _execCommand = _asyncToGenerator(function*(
    command,
    commandName,
    argsString,
    args,
    structuredArgs,
    commandSpecificConsole,
    respond,
    messageId
  ) {
    let makeResponse = success;

    try {
      if (shouldDebugCommand(argsString)) {
        throw new Error(
          `Stopping for debugging. Command '${commandName} ...' matched by the 'JS_WORKER_TOOL_DEBUG_RE' environment variable`
        );
      }

      yield command(args.slice(), structuredArgs, commandSpecificConsole);
    } catch (e) {
      commandSpecificConsole.error(e.stack);
      makeResponse = commandError;
    }

    respond(makeResponse(messageId));
  });
  return _execCommand.apply(this, arguments);
}

function shouldDebugCommand(argsString) {
  return DEBUG_RE && DEBUG_RE.test(argsString);
}

const error = (id, exitCode) => ({
  type: "error",
  id,
  exit_code: exitCode
});

const unknownMessage = id => error(id, 1);

const invalidMessage = id => error(id, 2);

const commandError = id => error(id, 3);

const success = id => ({
  type: "result",
  id,
  exit_code: 0
});

module.exports = buckWorker;
