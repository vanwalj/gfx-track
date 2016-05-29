'use strict';

import fetch from 'isomorphic-fetch';

const API_BASE_PATH = 'https://api-gfx-track.herokuapp.com/';

export const REQUEST_GFX = 'REQUEST_GFX';
export const RECEIVE_GFX = 'REQUEST_GFX';

const requestGFX = () => ({
  type: REQUEST_GFX
});

const receiveGFX = list => ({
  type: RECEIVE_GFX,
  list
});

export const fetchGFX = () =>
  dispatch => {
    dispatch(requestGFX());
    return fetch(`${API_BASE_PATH}/gfx`)
      .then(response => response.json())
      .then(gfx => dispatch(receiveGFX(gfx)));
  };
