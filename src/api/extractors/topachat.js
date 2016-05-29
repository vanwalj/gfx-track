'use strict';

const Extractor = require('./extractor');

class TopachatExtractor extends Extractor {
  constructor (url) {
    super(url);
  }
  extract () {
    return super._load()
      .then($ => ({
        price: parseInt(parseFloat($('span[itemprop="price"]').text().replace(',', '.')) * 100),
        inStock: $('section#panier').hasClass('en-stock')
      }));
  }
}

module.exports = TopachatExtractor;
