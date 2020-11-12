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

function _toConsumableArray(arr) {
  return (
    _arrayWithoutHoles(arr) ||
    _iterableToArray(arr) ||
    _unsupportedIterableToArray(arr) ||
    _nonIterableSpread()
  );
}

function _nonIterableSpread() {
  throw new TypeError(
    "Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."
  );
}

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))
    return _arrayLikeToArray(o, minLen);
}

function _iterableToArray(iter) {
  if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter))
    return Array.from(iter);
}

function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) return _arrayLikeToArray(arr);
}

function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;
  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];
  return arr2;
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

function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);
  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    if (enumerableOnly)
      symbols = symbols.filter(function(sym) {
        return Object.getOwnPropertyDescriptor(object, sym).enumerable;
      });
    keys.push.apply(keys, symbols);
  }
  return keys;
}

function _objectSpread(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};
    if (i % 2) {
      ownKeys(Object(source), true).forEach(function(key) {
        _defineProperty(target, key, source[key]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
      ownKeys(Object(source)).forEach(function(key) {
        Object.defineProperty(
          target,
          key,
          Object.getOwnPropertyDescriptor(source, key)
        );
      });
    }
  }
  return target;
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

const HermesCompiler = require("metro-hermes-compiler");

const JsFileWrapping = require("metro/src/ModuleGraph/worker/JsFileWrapping");

const assetTransformer = require("./utils/assetTransformer");

const babylon = require("@babel/parser");

const collectDependencies = require("metro/src/ModuleGraph/worker/collectDependencies");

const generateImportNames = require("metro/src/ModuleGraph/worker/generateImportNames");

const nullthrows = require("nullthrows");

const generate = require("@babel/generator").default;

const getCacheKey = require("metro-cache-key");

const getMinifier = require("./utils/getMinifier");

const _require = require("metro-transform-plugins"),
  constantFoldingPlugin = _require.constantFoldingPlugin,
  getTransformPluginCacheKeyFiles = _require.getTransformPluginCacheKeyFiles,
  importExportPlugin = _require.importExportPlugin,
  inlinePlugin = _require.inlinePlugin,
  normalizePseudoGlobals = _require.normalizePseudoGlobals;

const inlineRequiresPlugin = require("babel-preset-fbjs/plugins/inline-requires");

const _require2 = require("@babel/core"),
  transformFromAstSync = _require2.transformFromAstSync;

const _require3 = require("metro-cache"),
  stableHash = _require3.stableHash;

const types = require("@babel/types");

const countLines = require("metro/src/lib/countLines");

const _require4 = require("metro-source-map"),
  fromRawMappings = _require4.fromRawMappings,
  toBabelSegments = _require4.toBabelSegments,
  toSegmentTuple = _require4.toSegmentTuple;

function getDynamicDepsBehavior(inPackages, filename) {
  switch (inPackages) {
    case "reject":
      return "reject";

    case "throwAtRuntime":
      const isPackage = /(?:^|[/\\])node_modules[/\\]/.test(filename);
      return isPackage ? inPackages : "reject";

    default:
      inPackages;
      throw new Error(
        `invalid value for dynamic deps behavior: \`${inPackages}\``
      );
  }
}

const minifyCode = /*#__PURE__*/ (function() {
  var _ref = _asyncToGenerator(function*(
    config,
    projectRoot,
    filename,
    code,
    source,
    map
  ) {
    let reserved =
      arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : [];
    const sourceMap = fromRawMappings([
      {
        code,
        source,
        map,
        functionMap: null,
        path: filename
      }
    ]).toMap(undefined, {});
    const minify = getMinifier(config.minifierPath);

    try {
      const minified = yield minify({
        code,
        map: sourceMap,
        filename,
        reserved,
        config: config.minifierConfig
      });
      return {
        code: minified.code,
        map: minified.map
          ? toBabelSegments(minified.map).map(toSegmentTuple)
          : []
      };
    } catch (error) {
      if (error.constructor.name === "JS_Parse_Error") {
        throw new Error(
          `${error.message} in file ${filename} at ${error.line}:${error.col}`
        );
      }

      throw error;
    }
  });

  return function minifyCode(_x, _x2, _x3, _x4, _x5, _x6) {
    return _ref.apply(this, arguments);
  };
})();

const compileToBytecode = (code, type, options) => {
  if (type.startsWith("js/module")) {
    const index = code.lastIndexOf(")");
    code =
      code.slice(0, index) +
      ",$$METRO_D[0],$$METRO_D[1],$$METRO_D[2]" +
      code.slice(index);
  }

  return HermesCompiler.compile(code, options);
};

class InvalidRequireCallError extends Error {
  constructor(innerError, filename) {
    super(`${filename}:${innerError.message}`);
    this.innerError = innerError;
    this.filename = filename;
  }
}

module.exports = {
  transform: (function() {
    var _ref2 = _asyncToGenerator(function*(
      config,
      projectRoot,
      filename,
      data,
      options
    ) {
      const sourceCode = data.toString("utf8");
      let type = "js/module";
      let bytecodeType = "bytecode/module";

      if (options.type === "asset") {
        type = "js/module/asset";
        bytecodeType = "bytecode/module/asset";
      }

      if (options.type === "script") {
        type = "js/script";
        bytecodeType = "bytecode/script";
      }

      if (filename.endsWith(".json")) {
        let code = JsFileWrapping.wrapJson(sourceCode, config.globalPrefix);
        let map = [];

        if (options.minify) {
          var _yield$minifyCode = yield minifyCode(
            config,
            projectRoot,
            filename,
            code,
            sourceCode,
            map
          );

          map = _yield$minifyCode.map;
          code = _yield$minifyCode.code;
        }

        const output = [
          {
            data: {
              code,
              lineCount: countLines(code),
              map,
              functionMap: null
            },
            type
          }
        ];

        if (options.runtimeBytecodeVersion) {
          output.push({
            data: compileToBytecode(code, type, {
              sourceURL: filename,
              sourceMap: fromRawMappings([
                {
                  code,
                  source: sourceCode,
                  map,
                  functionMap: null,
                  path: filename
                }
              ]).toString()
            }),
            type: bytecodeType
          });
        }

        return {
          dependencies: [],
          output
        };
      } // $FlowFixMe TODO t26372934 Plugin system

      const transformer = require(config.babelTransformerPath);

      const transformerArgs = {
        filename,
        options: _objectSpread(
          _objectSpread({}, options),
          {},
          {
            enableBabelRCLookup: config.enableBabelRCLookup,
            enableBabelRuntime: config.enableBabelRuntime,
            globalPrefix: config.globalPrefix,
            // Inline requires are now performed at a secondary step. We cannot
            // unfortunately remove it from the internal transformer, since this one
            // is used by other tooling, and this would affect it.
            inlineRequires: false,
            nonInlinedRequires: [],
            projectRoot,
            publicPath: config.publicPath
          }
        ),
        plugins: [],
        src: sourceCode
      };
      const transformResult =
        type === "js/module/asset"
          ? _objectSpread(
              _objectSpread(
                {},
                yield assetTransformer.transform(
                  transformerArgs,
                  config.assetRegistryPath,
                  config.assetPlugins
                )
              ),
              {},
              {
                functionMap: null
              }
            )
          : yield transformer.transform(transformerArgs); // Transformers can ouptut null ASTs (if they ignore the file). In that case
      // we need to parse the module source code to get their AST.

      let ast =
        transformResult.ast ||
        babylon.parse(sourceCode, {
          sourceType: "unambiguous"
        });

      const _generateImportNames = generateImportNames(ast),
        importDefault = _generateImportNames.importDefault,
        importAll = _generateImportNames.importAll; // Add "use strict" if the file was parsed as a module, and the directive did
      // not exist yet.

      const directives = ast.program.directives;

      if (
        ast.program.sourceType === "module" &&
        directives.findIndex(d => d.value.value === "use strict") === -1
      ) {
        directives.push(types.directive(types.directiveLiteral("use strict")));
      } // Perform the import-export transform (in case it's still needed), then
      // fold requires and perform constant folding (if in dev).

      const plugins = [];

      const opts = _objectSpread(
        _objectSpread({}, options),
        {},
        {
          inlineableCalls: [importDefault, importAll],
          importDefault,
          importAll
        }
      );

      if (options.experimentalImportSupport) {
        plugins.push([importExportPlugin, opts]);
      }

      if (options.inlineRequires) {
        plugins.push([
          inlineRequiresPlugin,
          _objectSpread(
            _objectSpread({}, opts),
            {},
            {
              ignoredRequires: options.nonInlinedRequires
            }
          )
        ]);
      }

      if (!options.dev) {
        plugins.push([constantFoldingPlugin, opts]);
      }

      plugins.push([inlinePlugin, opts]);
      ast = nullthrows(
        transformFromAstSync(ast, "", {
          ast: true,
          babelrc: false,
          code: false,
          configFile: false,
          comments: false,
          compact: false,
          filename,
          plugins,
          sourceMaps: false
        }).ast
      );
      let dependencyMapName = "";
      let dependencies;
      let wrappedAst; // If the module to transform is a script (meaning that is not part of the
      // dependency graph and it code will just be prepended to the bundle modules),
      // we need to wrap it differently than a commonJS module (also, scripts do
      // not have dependencies).

      if (type === "js/script") {
        dependencies = [];
        wrappedAst = JsFileWrapping.wrapPolyfill(ast);
      } else {
        try {
          const opts = {
            asyncRequireModulePath: config.asyncRequireModulePath,
            dynamicRequires: getDynamicDepsBehavior(
              config.dynamicDepsInPackages,
              filename
            ),
            inlineableCalls: [importDefault, importAll],
            keepRequireNames: options.dev,
            allowOptionalDependencies: config.allowOptionalDependencies
          };

          var _collectDependencies = collectDependencies(ast, opts);

          ast = _collectDependencies.ast;
          dependencies = _collectDependencies.dependencies;
          dependencyMapName = _collectDependencies.dependencyMapName;
        } catch (error) {
          if (error instanceof collectDependencies.InvalidRequireCallError) {
            throw new InvalidRequireCallError(error, filename);
          }

          throw error;
        }

        var _JsFileWrapping$wrapM = JsFileWrapping.wrapModule(
          ast,
          importDefault,
          importAll,
          dependencyMapName,
          config.globalPrefix
        );

        wrappedAst = _JsFileWrapping$wrapM.ast;
      }

      const reserved =
        options.minify && data.length <= config.optimizationSizeLimit
          ? normalizePseudoGlobals(wrappedAst)
          : [];
      const result = generate(
        wrappedAst,
        {
          comments: false,
          compact: false,
          filename,
          retainLines: false,
          sourceFileName: filename,
          sourceMaps: true
        },
        sourceCode
      );
      let map = result.rawMappings
        ? result.rawMappings.map(toSegmentTuple)
        : [];
      let code = result.code;

      if (options.minify) {
        var _yield$minifyCode2 = yield minifyCode(
          config,
          projectRoot,
          filename,
          result.code,
          sourceCode,
          map,
          reserved
        );

        map = _yield$minifyCode2.map;
        code = _yield$minifyCode2.code;
      }

      const output = [
        {
          data: {
            code,
            lineCount: countLines(code),
            map,
            functionMap: transformResult.functionMap
          },
          type
        }
      ];

      if (options.runtimeBytecodeVersion) {
        output.push({
          data: compileToBytecode(code, type, {
            sourceURL: filename,
            sourceMap: fromRawMappings([
              {
                code,
                source: sourceCode,
                map,
                functionMap: null,
                path: filename
              }
            ]).toString()
          }),
          type: bytecodeType
        });
      }

      return {
        dependencies,
        output
      };
    });

    return function transform(_x7, _x8, _x9, _x10, _x11) {
      return _ref2.apply(this, arguments);
    };
  })(),
  getCacheKey: config => {
    const babelTransformerPath = config.babelTransformerPath,
      minifierPath = config.minifierPath,
      remainingConfig = _objectWithoutProperties(config, [
        "babelTransformerPath",
        "minifierPath"
      ]);

    const filesKey = getCacheKey(
      [
        require.resolve(babelTransformerPath),
        require.resolve(minifierPath),
        require.resolve("./utils/getMinifier"),
        require.resolve("./utils/assetTransformer"),
        require.resolve("metro/src/ModuleGraph/worker/collectDependencies"),
        require.resolve("metro/src/ModuleGraph/worker/generateImportNames"),
        require.resolve("metro/src/ModuleGraph/worker/JsFileWrapping")
      ].concat(_toConsumableArray(getTransformPluginCacheKeyFiles()))
    );

    const babelTransformer = require(babelTransformerPath);

    return [
      filesKey,
      stableHash(remainingConfig).toString("hex"),
      babelTransformer.getCacheKey ? babelTransformer.getCacheKey() : ""
    ].join("$");
  }
};