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

var _prismReactRenderer = _interopRequireWildcard(
  require("prism-react-renderer")
);

function _interopRequireWildcard(obj) {
  if (obj && obj.__esModule) {
    return obj;
  } else {
    var newObj = {};
    if (obj != null) {
      for (var key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
          var desc =
            Object.defineProperty && Object.getOwnPropertyDescriptor
              ? Object.getOwnPropertyDescriptor(obj, key)
              : {};
          if (desc.get || desc.set) {
            Object.defineProperty(newObj, key, desc);
          } else {
            newObj[key] = obj[key];
          }
        }
      }
    }
    newObj.default = obj;
    return newObj;
  }
}

function _extends() {
  _extends =
    Object.assign ||
    function(target) {
      for (var i = 1; i < arguments.length; i++) {
        var source = arguments[i];
        for (var key in source) {
          if (Object.prototype.hasOwnProperty.call(source, key)) {
            target[key] = source[key];
          }
        }
      }
      return target;
    };
  return _extends.apply(this, arguments);
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

const React = require("react");

const filesize = require("filesize");

const oneDarkPro = require("./themeOneDark");

const _require = require("emotion"),
  css = _require.css,
  injectGlobal = _require.injectGlobal;

class InfoDrawer extends React.Component {
  constructor() {
    super(...arguments);

    _defineProperty(this, "state", {
      visible: false
    });

    _defineProperty(this, "showDrawer", () => {
      this.setState({
        visible: true
      });
    });

    _defineProperty(this, "onClose", () => {
      this.setState({
        visible: false
      });
    });
  }

  render() {
    return React.createElement(
      "div",
      null,
      React.createElement(_antd.Button, {
        className: infoDrawerButton,
        type: "default",
        size: "large",
        onClick: this.showDrawer,
        icon: "info"
      }),
      React.createElement(
        _antd.Drawer,
        {
          title: this.props.data ? this.props.data.label : "Module Info",
          placement: "left",
          mask: false,
          onClose: this.onClose,
          visible: this.state.visible,
          width: 400
        },
        this.props.data
          ? React.createElement(NodeDataView, {
              data: this.props.data
            })
          : "Select a node to display information about it..."
      )
    );
  }
}

const codeModalStyle = {
  padding: 0,
  maxHeight: "70vh",
  overflowY: "auto"
};

class ResourceModal extends React.Component {
  constructor() {
    super(...arguments);

    _defineProperty(this, "state", {
      visible: false
    });

    _defineProperty(this, "toggleVisible", () => {
      this.setState(s => ({
        visible: !s.visible
      }));
    });
  }

  render() {
    const _this$props = this.props,
      title = _this$props.title,
      type = _this$props.type,
      data = _this$props.data;
    const visible = this.state.visible;
    const supportedLanguages = {
      js: "javascript",
      jsx: "jsx",
      json: "json",
      yml: "yaml",
      yaml: "yaml",
      css: "css",
      less: "less",
      sass: "sass",
      scss: "scss",
      stylus: "stylus",
      re: "reason",
      ts: "typescript",
      ml: "ocaml",
      html: "html",
      xml: "xml"
    };
    return React.createElement(
      React.Fragment,
      null,
      React.createElement(_antd.Button, {
        icon: "arrows-alt",
        onClick: this.toggleVisible
      }),
      React.createElement(
        _antd.Modal,
        {
          title: title,
          footer: null,
          visible: visible,
          onCancel: this.toggleVisible,
          width: 840,
          bodyStyle: codeModalStyle
        },
        Object.keys(supportedLanguages).includes(type)
          ? React.createElement(
              _prismReactRenderer.default,
              _extends({}, _prismReactRenderer.defaultProps, {
                code: data,
                theme: oneDarkPro,
                language: supportedLanguages[type]
              }),
              _ref => {
                let className = _ref.className,
                  style = _ref.style,
                  tokens = _ref.tokens,
                  getLineProps = _ref.getLineProps,
                  getTokenProps = _ref.getTokenProps;
                return React.createElement(
                  "pre",
                  {
                    className: `${className} ${codeContainer}`,
                    style: style
                  },
                  tokens.map((line, i) =>
                    React.createElement(
                      "div",
                      getLineProps({
                        line,
                        key: i
                      }),
                      line.map((token, key) =>
                        React.createElement(
                          "span",
                          getTokenProps({
                            token,
                            key
                          })
                        )
                      )
                    )
                  )
                );
              }
            )
          : React.createElement(
              "pre",
              {
                className: codeContainer
              },
              data
            )
      )
    );
  }
}

const Item = _ref2 => {
  let title = _ref2.title,
    children = _ref2.children,
    _ref2$vertical = _ref2.vertical,
    vertical = _ref2$vertical === void 0 ? false : _ref2$vertical,
    actions = _ref2.actions;
  return React.createElement(
    _antd.List.Item,
    null,
    React.createElement(
      "div",
      {
        className: `${itemWrapper} ${
          vertical ? itemWrapperVertical : itemWrapperHorizontal
        }`
      },
      React.createElement(
        "div",
        {
          className: itemTitle
        },
        title
      ),
      React.createElement(
        "div",
        {
          className: `${itemContent} ${
            vertical ? itemContentVertical : itemContentHorizontal
          }`
        },
        children
      ),
      actions != null &&
        React.createElement(
          "div",
          {
            className: itemActions
          },
          actions
        )
    )
  );
};

const NodeDataView = _ref3 => {
  var _ref4;

  let data = _ref3.data;
  const sourceType = data.id.slice(data.id.lastIndexOf(".") + 1);
  const isImageType = /png|gif|jpe?g|svg|webp|bmp/.test(sourceType);
  const outputType = data.type.slice(0, data.type.indexOf("/"));
  return React.createElement(
    React.Fragment,
    null,
    React.createElement(
      _antd.List,
      null,
      React.createElement(
        Item,
        {
          title: "Path",
          vertical: true
        },
        React.createElement(ScrollablePath, {
          path: data.id
        })
      ),
      React.createElement(
        Item,
        {
          title: "Source",
          actions:
            !isImageType &&
            React.createElement(ResourceModal, {
              title: "Source",
              type: sourceType, // By default, data.source is receive as a base64 string, since
              // it can be non-textual data, such as an image.
              data: atob(data.source)
            }),
          vertical: isImageType
        },
        isImageType &&
          React.createElement(
            "div",
            {
              className: sourceImageContainer
            },
            React.createElement("img", {
              src: `data:image/${sourceType};base64,${data.source}`
            })
          )
      ),
      React.createElement(
        Item,
        {
          title: "Output",
          actions: React.createElement(ResourceModal, {
            title: "Output",
            type: outputType,
            data: data.output
          })
        },
        filesize(data.size)
      )
    ),
    React.createElement(
      _antd.Collapse,
      {
        defaultActiveKey: (_ref4 = []).concat.apply(_ref4, [
          data.deps.length > 0 ? ["deps"] : [],
          data.inverseDeps.length > 0 ? ["invdeps"] : []
        ])
      },
      React.createElement(
        _antd.Collapse.Panel,
        {
          key: "deps",
          disabled: data.deps.length === 0,
          header: React.createElement(
            "div",
            {
              className: depHeader
            },
            "Dependencies",
            React.createElement(
              "div",
              {
                className: depNumber
              },
              React.createElement(
                _antd.Tag,
                {
                  color: "blue"
                },
                data.deps.length
              )
            )
          )
        },
        React.createElement(DepList, {
          deps: data.deps
        })
      ),
      React.createElement(
        _antd.Collapse.Panel,
        {
          key: "invdeps",
          disabled: data.inverseDeps.length === 0,
          header: React.createElement(
            "div",
            {
              className: depHeader
            },
            "Inverse dependencies",
            React.createElement(
              "div",
              {
                className: depNumber
              },
              React.createElement(
                _antd.Tag,
                {
                  color: "blue"
                },
                data.inverseDeps.length
              )
            )
          )
        },
        React.createElement(DepList, {
          deps: data.inverseDeps
        })
      )
    )
  );
};

const DepList = props =>
  React.createElement(
    _antd.List,
    {
      size: "small",
      className: depList
    },
    props.deps.map(dep =>
      React.createElement(
        Item,
        {
          key: dep,
          title: dep.slice(dep.lastIndexOf("/") + 1),
          vertical: true
        },
        React.createElement(ScrollablePath, {
          path: dep
        })
      )
    )
  );

class ScrollablePath extends React.Component {
  constructor() {
    super(...arguments);

    _defineProperty(this, "scrollRef", React.createRef());
  }

  componentDidMount() {
    if (this.scrollRef.current != null) {
      // Default the path to be scrolled all the way to the right, as we expect
      // the last segments of the path to be the most relevant to the user.
      this.scrollRef.current.scrollLeft = this.scrollRef.current.scrollWidth;
    }
  }

  render() {
    return React.createElement(
      "div",
      {
        className: pathWrapper,
        ref: this.scrollRef
      },
      React.createElement(
        "div",
        {
          className: pathWrapperInner
        },
        this.props.path
      )
    );
  }
} // Fixes an issue with flex and white-space: nowrap;
// Without this, there's no way of having a scrollable path inside of a
// List.Item.

injectGlobal`
  .ant-list-item-content {
    width: 100%;
  }
`;
const infoDrawerButton = css`
  position: absolute;
  top: 20px;
  left: 20px;
  font-size: 1.5em;
`;
const depHeader = css`
  display: flex;
`;
const depNumber = css`
  flex: 1;
  padding-right: 10px;
  text-align: right;
  font-family: Consolas, Menlo, Courier, monospace;
`;
const depList = css`
  max-height: 300px;
  overflow-y: auto;
`;
const itemWrapper = css`
  display: flex;
  width: 100%;
`;
const itemWrapperVertical = css`
  display: flex;
  flex-direction: column;
`;
const itemWrapperHorizontal = css`
  align-items: center;
`;
const itemTitle = css`
  font-weight: bold;
  padding-right: 10px;
`;
const itemContent = css`
  flex: 1;
  display: flex;
`;
const itemContentVertical = css`
  justify-content: flex-start;
`;
const itemContentHorizontal = css`
  justify-content: flex-end;
`;
const itemActions = css`
  padding-left: 10px;
`;
const pathWrapper = css`
  overflow-x: auto;
`;
const pathWrapperInner = css`
  font-family: Consolas, Menlo, Courier, monospace;
  white-space: nowrap;
`;
const codeContainer = css`
  /* Same as the chosen theme, vsDark */
  background-color: rgb(30, 30, 30);
  /* Define a default color for the case where we don't highlight the code */
  color: white;
  padding: 10px;
  margin: 0px;
`;
const sourceImageContainer = css`
  display: "flex";
  justify-content: flex-start;
  max-height: 300px;
  overflow-y: auto;
`;
module.exports = InfoDrawer;
