'use strict';

import React from 'react';
import numeral from '../services/numeral';

module.exports = ({ value }) =>
  <span>{numeral(value / 100).format('0.00$')}</span>
;
