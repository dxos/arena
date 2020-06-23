//
// Copyright 2019 Wireline, Inc.
//

const merge = require('webpack-merge');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

const baseConfig = require('./webpack-common.config');

module.exports = merge(baseConfig, {

  entry: './src/main',

  plugins: [
    // http://127.0.0.1:8888
    // https://github.com/webpack-contrib/webpack-bundle-analyzer#options-for-plugin
    new BundleAnalyzerPlugin({
      openAnalyzer: false
    })
  ]
});
