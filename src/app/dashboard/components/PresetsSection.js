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

const React = require("react");

const URLParamsCascader = require("./URLParamsCascader");

const _require = require("emotion"),
  css = _require.css;

const card = css`
  margin: 8px 0px;
`;
const section = css`
  margin-top: -8px;
  margin-bottom: 8px;
`;
const sectionHeading = css`
  margin-top: 16px;
  margin-bottom: 4px;
`;
const buildButton = css`
  float: right;
`; // $FlowIssue #36262791 - missing definition for React.memo

const PresetsSection = React.memo(_ref => {
  let presets = _ref.presets,
    platforms = _ref.platforms,
    onBuildPreset = _ref.onBuildPreset;
  let featuredPresets = presets.filter(preset => preset.featured);

  if (featuredPresets.length === 0) {
    featuredPresets = presets;
  }

  return React.createElement(
    "div",
    {
      className: section
    },
    React.createElement(
      _antd.Row,
      {
        gutter: 8,
        type: "flex",
        justify: "center"
      },
      React.createElement(
        _antd.Col,
        {
          span: 16,
          className: sectionHeading
        },
        "Choose a bundle to build:"
      )
    ),
    React.createElement(
      _antd.Row,
      {
        gutter: 8,
        type: "flex",
        justify: "center"
      },
      React.createElement(
        _antd.Col,
        {
          span: 16
        },
        React.createElement(
          _antd.Row,
          {
            gutter: 16,
            type: "flex",
            justify: "start"
          },
          featuredPresets.map((preset, index) => {
            return React.createElement(
              _antd.Col,
              {
                key: index,
                xs: 24,
                md: 12,
                xl: 8
              },
              React.createElement(PresetCard, {
                preset: preset,
                platforms: platforms,
                onBuildPreset: onBuildPreset
              })
            );
          })
        )
      )
    )
  );
});

const PresetCard = _ref2 => {
  let preset = _ref2.preset,
    platforms = _ref2.platforms,
    onBuildPreset = _ref2.onBuildPreset;
  return React.createElement(
    _antd.Card,
    {
      title: React.createElement(
        React.Fragment,
        null,
        preset.name,
        " ",
        React.createElement(
          URLParamsCascader,
          {
            options: getPresetBuildOptions(preset, platforms),
            expandTrigger: "hover",
            value: [],
            onChange: params => {
              onBuildPreset(preset.entryPath, params);
            }
          },
          React.createElement(
            _antd.Button,
            {
              type: "dashed",
              size: "small",
              className: buildButton
            },
            "Build"
          )
        )
      ),
      className: card
    },
    preset.description
  );
};

function getPresetBuildOptions(preset, platforms) {
  const presetPlatforms = preset.platforms || platforms;

  if (presetPlatforms.length === 1) {
    const platform = presetPlatforms[0];
    return [
      {
        value: {
          dev: "1",
          platform
        },
        label: `${platform}, dev`
      },
      {
        value: {
          platform
        },
        label: `${platform}, prod`
      }
    ];
  }

  return presetPlatforms.map(platform => ({
    value: {
      platform
    },
    label: platform,
    children: [
      {
        value: {
          dev: "1"
        },
        label: "dev"
      },
      {
        value: {},
        label: "prod"
      }
    ]
  }));
}

module.exports = PresetsSection;
