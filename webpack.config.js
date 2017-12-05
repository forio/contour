const path = require('path');
const webpack = require('webpack');

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
    d3: 'd3'
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
    })
  ],
  devtool: 'source-map',
};