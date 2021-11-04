var path = require('path');
var pkg = require('./package.json');
var camelcase = require('camelcase');
var process = require('process');
var webpack = require('webpack');
var env = process.env;
var NODE_ENV = env.NODE_ENV;
var MIN = env.MIN;
var PROD = NODE_ENV === 'production';

var config = {
  devtool: PROD ? false : 'inline-source-map',
  entry: './src/index.js',
  output: {
    path: path.join( __dirname ),
    filename: pkg.name + '.js',
    library: camelcase( pkg.name ),
    libraryTarget: 'umd'
  },
  module: {
    rules: []
  },
  externals: PROD ? {
    'weaverjs': {
      commonjs2: 'weaverjs',
      commonjs: 'weaverjs',
      amd: 'weaverjs',
      root: 'weaver'
    }
  } : {},
  plugins: MIN ? [
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
        drop_console: false
      }
    })
  ] : []
};

module.exports = config;
