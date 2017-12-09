const path = require('path');
const webpack = require('webpack');
const pkg = require('./package.json');

module.exports = {
  entry: {
    'contour': './src/scripts/index.js',
    'contour.min': './src/scripts/index.js',
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
    library: 'Contour',
    libraryTarget: 'umd'
  },
  externals: {
    d3: 'd3',
    $: 'jQuery',
    _: 'lodash'
  },
  module: {
    rules: [
      { test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader' }
    ]
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin({
      minimize: true,
      include: /\.min\.js$/,
      compress: { warnings: false },
      output: { comments: false, beautify: false },
      sourceMap: true,
    }),
    new webpack.DefinePlugin({
      VERSION: JSON.stringify(pkg.version)
    })

  ],
  devtool: 'source-map',
};