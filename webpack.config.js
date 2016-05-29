'use strict';

const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: ['./src/index.js'],
  output: { path: path.resolve(__dirname, 'dist'), filename: 'bundle.js' },
  cache: true,
  debug: true,
  devtool: 'source-map',
  module: {
    loaders: [{
      test: /\.jsx?$/,
      loader: 'babel',
      exclude: /node_modules/,
      query: {
        presets: ['es2015', 'react', 'stage-2'],
        plugins: ['transform-runtime']
      }
    }, {
      test: /\.less$/,
      loader: 'style!css!less'
    }]
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Hello',
      template: './src/index.ejs'
    })
  ],
  devServer: {
    outputPath: path.join(__dirname, 'dist'),
    contentBase: 'dist',
    inline: true,
    open: true
  }
};
