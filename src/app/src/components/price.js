'use strict';

import React from 'react';
import numeral from '../services/numeral';

module.exports = (props) =>
  <span {...props}>{numeral(props.value / 100).format('0.00$')}</span>
;
