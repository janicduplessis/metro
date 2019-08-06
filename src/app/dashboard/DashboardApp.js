/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 *
 * @format
 */

/* eslint-env browser */
"use strict";

var _antd = require("antd");

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

const BundlePlots = require("./components/BundlePlots");

const BundleRunForm = require("./components/BundleRunForm");

const React = require("react");

const WelcomeMessage = require("./components/WelcomeMessage");

const handleAPIError = require("../utils/handleAPIError");

const _require = require("emotion"),
  injectGlobal = _require.injectGlobal,
  css = _require.css;

const _require2 = require("react-router-dom"),
  Link = _require2.Link;

class DashboardApp extends React.Component {
  constructor() {
    super(...arguments);

    _defineProperty(this, "_bundleRunForm", React.createRef());

    _defineProperty(this, "state", {
      metroHistory: undefined,
      selectedBundleHash: undefined,
      isLoadingData: false,
      isBundling: false,
      visualizerConfig: undefined,
      platforms: ["ios", "android", "windows", "web"]
    });

    _defineProperty(this, "_handleReload", () => {
      this.fetchData();
    });

    _defineProperty(this, "_handleBuildPreset", (entryPath, buildOptions) => {
      const bundleRunForm = this._bundleRunForm.current;

      if (bundleRunForm) {
        bundleRunForm.build(entryPath, buildOptions);
      }
    });
  }

  componentDidMount() {
    this.fetchData();
  }

  fetchData() {
    this.setState({
      isLoadingData: true
    });
    return Promise.all([
      fetch("/visualizer/bundles"),
      fetch("/visualizer/platforms"),
      fetch("/visualizer/config")
    ])
      .then(responses => {
        this.setState({
          isLoadingData: false
        });
        return Promise.all(responses.map(res => handleAPIError(res).json()));
      })
      .then(_ref => {
        let _ref2 = _slicedToArray(_ref, 3),
          metroHistory = _ref2[0],
          platforms = _ref2[1],
          visualizerConfig = _ref2[2];

        this.setState({
          metroHistory,
          platforms,
          visualizerConfig
        });
      })
      .catch(error => _antd.message.error(error.message));
  }

  render() {
    const _this$state = this.state,
      metroHistory = _this$state.metroHistory,
      isLoadingData = _this$state.isLoadingData,
      isBundling = _this$state.isBundling,
      visualizerConfig = _this$state.visualizerConfig,
      platforms = _this$state.platforms;
    const loadedEmptyHistory =
      !isLoadingData && metroHistory && Object.keys(metroHistory).length === 0;
    return React.createElement(
      "div",
      null,
      React.createElement(
        _antd.Row,
        {
          type: "flex",
          justify: "center"
        },
        React.createElement("img", {
          src: "https://facebook.github.io/metro/img/metro.svg",
          className: logo,
          alt: "logo"
        })
      ),
      React.createElement(BundleRunForm, {
        ref: this._bundleRunForm,
        platforms: platforms,
        handleStartedBundling: () =>
          this.setState({
            isBundling: true
          }),
        handleFinishedBundling: () => {
          this.fetchData().then(() =>
            this.setState({
              isBundling: false
            })
          );
        }
      }),
      loadedEmptyHistory && !isBundling
        ? React.createElement(WelcomeMessage, {
            onReload: this._handleReload,
            platforms: platforms,
            presets: visualizerConfig && visualizerConfig.presets,
            onBuildPreset: this._handleBuildPreset
          })
        : null,
      React.createElement(
        _antd.Row,
        {
          type: "flex",
          justify: "center",
          gutter: 8
        },
        React.createElement(
          _antd.Col,
          {
            span: 16
          },
          metroHistory &&
            Object.keys(metroHistory).map(bundleHash =>
              React.createElement(
                Link,
                {
                  to: `/graph/${bundleHash}`,
                  key: bundleHash
                },
                React.createElement(BundleCard, {
                  onClick: () =>
                    this.setState({
                      selectedBundleHash: bundleHash
                    }),
                  bundleInfo: metroHistory[bundleHash]
                })
              )
            )
        )
      ),
      (isLoadingData || isBundling) &&
        React.createElement(_antd.Icon, {
          type: "loading",
          className: loadingIndicator
        })
    );
  }
}

const BundleCard = props => {
  const entryFile = props.bundleInfo.options.entryFile;
  return React.createElement(
    _antd.Card,
    {
      onClick: props.onClick,
      className: bundleCard,
      hoverable: true
    },
    React.createElement(
      "p",
      {
        className: bundleCardTitle
      },
      entryFile.substring(entryFile.lastIndexOf("/") + 1),
      Object.keys(props.bundleInfo.builds)
        .map(id => props.bundleInfo.builds[id])
        .filter(info => info.isInitial)
        .map(info =>
          info.duration != null
            ? React.createElement(
                "span",
                {
                  className: initialInfo,
                  key: "initial"
                },
                info.duration,
                " ms | ",
                info.numModifiedFiles,
                " files"
              )
            : null
        )
    ),
    React.createElement(BundlePlots, {
      builds: Object.keys(props.bundleInfo.builds)
        .map(id => props.bundleInfo.builds[id])
        .filter(info => !info.isInitial && info.status === "done")
    }),
    React.createElement(
      _antd.Row,
      {
        type: "flex",
        className: tagsRow
      },
      Object.entries(props.bundleInfo.options).map(_ref3 => {
        let _ref4 = _slicedToArray(_ref3, 2),
          name = _ref4[0],
          option = _ref4[1];

        if (typeof option === "boolean" && option === true) {
          return React.createElement(
            _antd.Tag,
            {
              key: name
            },
            name
          );
        }

        if (typeof option === "string" && name === "platform") {
          return React.createElement(
            _antd.Tag,
            {
              key: name
            },
            option
          );
        }

        return null;
      })
    )
  );
};

injectGlobal`
  body {
    background-color: #f9f9f9;
  }
`;
const tagsRow = css`
  margin-top: 8px;
  margin-bottom: -8px;
`;
const bundleCard = css`
  width: 100%;
  margin: 8px 0px;
  word-wrap: break-word;
`;
const bundleCardTitle = css`
  font-size: 11pt;
  font-weight: 500;
`;
const logo = css`
  margin: 20px;
  height: 80px;
  width: 80px;
`;
const initialInfo = css`
  margin-left: 8px;
  font-size: 9pt;
  color: #aaa;
`;
const loadingIndicator = css`
  font-size: 4em;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translateY(-50%) translateX(-50%);
`;
module.exports = DashboardApp;
