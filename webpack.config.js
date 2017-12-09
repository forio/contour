const path = require('path');
const webpack = require('webpack');
const pkg = require('./package.json');
const ExtractTextPlugin = require("extract-text-webpack-plugin");

const extractLess = new ExtractTextPlugin({
    filename: '[name].css',
    disable: process.env.NODE_ENV === 'development'
});

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
      { test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader' },
      {
        test: /\.less$/,
        use: extractLess.extract({
          use: [{ loader: 'css-loader', options: { minimize: true, sourceMap: true } }, { loader: 'less-loader', options: { minimize: true, sourceMap: true } }],
          // use style-loader in development
          fallback: 'style-loader'
       })
      }
    ]
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin({
      minimize: true,
      include: /\.min\.(js|css)$/,
      compress: { warnings: false },
      output: { comments: false, beautify: false },
      sourceMap: true,
    }),
    new webpack.DefinePlugin({
      VERSION: JSON.stringify(pkg.version)
    }),
    extractLess
  ],
  devtool: 'source-map',
};