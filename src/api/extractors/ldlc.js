'use strict';

const Extractor = require('./extractor');

class LDLCExtractor extends Extractor {
  constructor (url) {
    super(url);
  }
  extract () {
    return super._load()
      .then($ => ({
        price: parseInt(parseFloat($('meta[itemprop="price"]').attr('content').replace(',', '.')) * 100),
        inStock: $('a#ctl00_cphMainContent_hlDispo').hasClass('d01')
      }));
  }
}

module.exports = LDLCExtractor;
