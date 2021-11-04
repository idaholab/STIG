const path = require('path');
const pkg = require('./package.json');
const camelcase = require('camelcase');
const process = require('process');
const env = process.env;

const NODE_ENV = env.NODE_ENV;
const PROD = NODE_ENV === 'production';
const SRC_DIR = './src';

let config = {
  // unless we are in production, use inline-source-map development tool
  // which helps track down bugs
  devtool: PROD ? false : 'inline-source-map',

  // entry point - src/index.js
  entry: path.join(__dirname, SRC_DIR, 'index.js'),

  // webpack throws warning if not provided a default mode
  // use the 'build:dev' script if you want development mode with non-minified file
  // this mode is used in 'build' script
  mode: 'production',
  output: {
    path: path.join( __dirname ),
    filename: pkg.name + '.js',
    library: camelcase( pkg.name ),
    libraryTarget: 'umd'
  },
  // loader
  module: {
    rules: [
      { 
        test: /\.js$/, 
        exclude: /node_modules/, 
        use: 'babel-loader' 
      }
    ]
  },
  // minimize file if mode is production
  optimization: {
    minimize: PROD ? true : false
  },
  externals: {
    geometric: 'geometric'
  }
};

module.exports = config;