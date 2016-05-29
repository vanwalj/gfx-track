'use strict';

const Extractor = require('./extractor');

class MaterielPointNetExtractor extends Extractor {
  constructor (url) {
    super(url);
  }
  extract () {
    return super._load()
      .then($ => ({
        price: parseInt(parseFloat($('span[itemprop="price"]').attr('content').replace(',', '.')) * 100),
        inStock: $('div.ProdInfoDispo>span>strong').text() === 'EN STOCK'
      }));
  }
}

module.exports = MaterielPointNetExtractor;
