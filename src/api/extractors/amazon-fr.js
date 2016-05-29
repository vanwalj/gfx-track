'use strict';

const Extractor = require('./extractor');

class AmazonFrExtractor extends Extractor {
  constructor (url) {
    super(url);
  }
  extract () {
    return super._load()
      .then($ => ({
        price: parseInt(parseFloat($('span#priceblock_ourprice').text().replace(',', '.').replace('EUR ', '')) * 100),
        inStock: $('div#availability>span').text() === ' En stock. '
      }));
  }
}

module.exports = AmazonFrExtractor;
