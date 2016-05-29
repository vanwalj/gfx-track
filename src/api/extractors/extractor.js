'use strict';

const Promise = require('bluebird');
const axios = require('axios');
const randomUa = require('random-ua');
const cheerio = require('cheerio');

class Extractor {
  constructor (url) {
    this.url = url;
  }
  _load() {
    return Promise.try(() => axios({
        url: this.url,
        headers: {
          'User-Agent': randomUa.generate()
        }
      }))
      .then(response => response.data)
      .then(page => cheerio.load(page));
  }
  extract () {
    throw new Error('Method not implemented');
  }
}

module.exports = Extractor;
