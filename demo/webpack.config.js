const path = require('path')
const webpack = require('webpack');
const WebpackWatchedGlobEntries = require('webpack-watched-glob-entries-plugin');
const glob = require("glob");
const _ = require("lodash");


const entries = _.fromPairs(glob.sync(__dirname + "/**/entry.js").map(v => {
  const tmp = v.split("/");
  return [tmp[tmp.length - 2], v];
}));
console.log(entries);

const config = {
  // entry: path.resolve(__dirname, 'index'),
  // entry: glob.sync(__dirname + "/**/entry.js"),
  entry: entries,
  resolve: { 
    extensions: ['.js','.vue'],
    alias: {
      vue: 'vue/dist/vue.js' // see: https://github.com/vuejs-templates/webpack/issues/215
    }
  },
  // output: { path: path.resolve(__dirname, '../dist'), filename: 'main.js' },
  output: {
    path: __dirname + "/dist",
    filename: "[name].bundle.js",
  },
  module: {
    rules: [
      { enforce: 'pre', test: /\.vue$/, loader: 'eslint-loader', exclude: /node_modules/ },
      { enforce: 'pre', test: /\.js$/, loader: 'eslint-loader', exclude: /node_modules/ },
      // { test: /\.vue$/, loader: 'vue-loader', exclude: /node_modules/ },
      { test: /\.vue$/, loader: 'vue-loader' },// for vue-flickity, should include node_modules
      { test: /\.js$/, loader: 'babel-loader', exclude: /node_modules/ },
    ]
  },
  plugins: [
    // new WebpackWatchedGlobEntries
  ]
}
//
// if (process.env.NODE_ENV === 'production') {
//   config.devtool = 'cheap-module-source-map'
//   config.plugins = [
//     new webpack.DefinePlugin({ 'process.env.NODE_ENV': JSON.stringify('production') }),
//     new webpack.optimize.UglifyJsPlugin({ compress: { warnings: false } })
//   ]
// } else {
//   config.devtool = 'eval'
//   config.plugins = [new webpack.DefinePlugin({ 'process.env.NODE_ENV': JSON.stringify('development') })]
// }

module.exports = config
