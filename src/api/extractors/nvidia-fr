'use strict';

const Extractor = require('./extractor');

class NvidiaFrExtractor extends Extractor {
  constructor (url) {
    super(url);
  }
  extract () {
    return super._load()
      .then($ => ({
        price: parseInt(parseFloat($('.price').text()) * 100),
        // Don't know yet what to parse to get the current stock state
        inStock: true
      }));
  }
}

module.exports = NvidiaFrExtractor;
