//
// Copyright 2020 DXOS.org
//

const path = require('path');
const webpack = require('webpack');

const packageJSON = require('./package.json');

const excludeDependencies = ['node_modules'].concat(
  Object.keys(packageJSON.dependencies)
    .filter(d => d.includes('@wirelineio') || d.includes('@dxos'))
    .map(d => d + '/')
);

module.exports = {
  target: 'node',

  mode: 'development',

  stats: 'errors-only',

  entry: path.resolve('./src/main.js'),

  output: {
    path: path.resolve('./out/builds/node'),
    filename: '[name].js',
    libraryTarget: 'commonjs2',
    devtoolModuleFilenameTemplate: '[absolute-resource-path]'
  },

  externals: {
    fatfs: 'fatfs',
    runtimejs: 'runtimejs',
    wrtc: 'wrtc',
    bip32: 'bip32',
    typeforce: 'typeforce'
  },

  resolve: {
    modules: ['node_modules']
  },

  plugins: [
    new webpack.IgnorePlugin(/\.\/native/),
    new webpack.IgnorePlugin(/^electron$/)
  ],

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: new RegExp(`(${excludeDependencies.join('|')})`), // Don't transpile deps.
        use: {
          loader: 'babel-loader',
          options: {
            cacheDirectory: './dist/babel-cache/'
          }
        }
      }
    ]
  }
};
