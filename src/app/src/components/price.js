'use strict';

const React = require('react');
const numeral = require('numeral');
numeral.language('fr', {
  delimiters: {
    thousands: ' ',
    decimal: ','
  },
  abbreviations: {
    thousand: 'k',
    million: 'm',
    billion: 'b',
    trillion: 't'
  },
  ordinal : function (number) {
    return number === 1 ? 'er' : 'ème';
  },
  currency: {
    symbol: '€'
  }
});
numeral.language('fr');

module.exports = ({ value }) =>
  <span>{numeral(value / 100).format('0.00$')}</span>
;
