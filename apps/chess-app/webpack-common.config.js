//
// Copyright 2020 DXOS.org
//

const path = require('path');
const VersionFile = require('webpack-version-file-plugin');
const webpack = require('webpack');

const { ConfigPlugin } = require('@dxos/config/ConfigPlugin');

const PUBLIC_URL = process.env.PUBLIC_URL || '';

module.exports = {

  devtool: 'eval-source-map',

  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    compress: true,
    disableHostCheck: true,
    port: 8080,
    watchOptions: {
      ignored: /node_modules/,
      aggregateTimeout: 600
    }
  },

  node: {
    fs: 'empty'
  },

  output: {
    path: `${__dirname}/dist`,
    filename: '[name].bundle.js',
    publicPath: PUBLIC_URL
  },

  optimization: {
    runtimeChunk: 'single',
    splitChunks: {
      chunks: 'all',
      maxInitialRequests: Infinity,
      minSize: 0,
      maxSize: 1024 * 1024 * 5, // 5MB
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          // name: 'vendor',
          name(module) {
            const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1];
            // return `vendor-${packageName.replace('@', '')}`;

            if (packageName.startsWith('@dxos')) {
              return 'dxos';
            }

            if (packageName.startsWith('@material-ui')) {
              return 'material-ui';
            }

            if (packageName.startsWith('@dxos')) {
              return 'dxos';
            }

            return 'vendor';
          }
        }
      }
    }
  },

  plugins: [
    new ConfigPlugin({
      path: path.resolve(__dirname, 'config'),
      dynamic: process.env.CONFIG_DYNAMIC
    }),
    // NOTE: Must be defined below Dotenv (otherwise will override).
    // https://webpack.js.org/plugins/environment-plugin
    new webpack.EnvironmentPlugin({
      PUBLIC_URL: '',
      DEBUG: ''
    }),

    // https://www.npmjs.com/package/webpack-version-file-plugin
    new VersionFile({
      packageFile: path.join(__dirname, 'package.json'),
      outputFile: path.join(__dirname, 'version.json')
    })
  ],

  module: {
    rules: [
      // js
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader'
        }
      },

      // config
      {
        test: /\.ya?ml$/,
        type: 'json',
        use: ['yaml-loader']
      },

      // fonts
      {
        test: /\.(woff(2)?|ttf|eot)(\?v=\d+\.\d+\.\d+)?$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: 'fonts/'
            }
          }
        ]
      },

      // svg
      {
        test: /\.svg$/,
        use: ['@svgr/webpack', 'file-loader'],
      }
    ]
  },

  resolve: {
    alias: {
      '@material-ui/styles': path.resolve(__dirname, '..', '..', 'node_modules/@material-ui/styles'),
      'react': path.resolve(__dirname, '..', '..', 'node_modules/react'),
      'react-dom': path.resolve(__dirname, '..', '..', 'node_modules/react-dom'),
      'yjs': path.resolve(__dirname, '..', '..', 'node_modules/yjs')
    }
  }
};
