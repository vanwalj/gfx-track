'use strict';

const webpack = require('webpack');
const path = require('path');

module.exports = {
  entry: ['./src/app/src/index.js'],
  output: { path: path.resolve(__dirname, 'src/app/dist'), filename: 'bundle.js' },
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
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': '"production"'
      }
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    })
  ],
  devServer: {
    outputPath: path.join(__dirname, 'dist'),
    contentBase: 'dist',
    inline: true,
    open: true
  }
};
