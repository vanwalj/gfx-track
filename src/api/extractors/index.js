'use strict';

const Promise = require('bluebird');
const axios = require('axios');
const cheerio = require('cheerio');
const randomUa = require('random-ua');

const availability = {
  IN_STOCK: 'IN_STOCK',
  OUT_OF_STOCK: 'OUT_OF_STOCK'
};

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

class MatDotNetExtractor extends Extractor {
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

class TopAchatExtractor extends Extractor {
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

module.exports = {
  ldlc: LDLCExtractor,
  matDotNet: MatDotNetExtractor,
  topAchat: TopAchatExtractor,
  amazonFr: AmazonFrExtractor
};
