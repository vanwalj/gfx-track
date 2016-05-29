'use strict';

if (process.env.NODE_ENV === 'dev') {
  require('babel-register');
  require('dotenv').config();
  module.exports = require('./src/api');
} else {
  module.exports = require('./dist/api');
}
