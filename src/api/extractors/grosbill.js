'use strict';

const Extractor = require('./extractor');

class GrosbillExtractor extends Extractor {
  constructor (url) {
    super(url);
  }
  extract () {
    return super._load()
      .then($ => ({
        price: parseInt(parseFloat($('meta[itemprop="price"]').attr('content')) * 100),
        inStock: $('.datasheet_stock_wrapper>div').hasClass('btn_en_stock_wrapper')
      }));
  }
}

module.exports = GrosbillExtractor;
