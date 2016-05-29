'use strict';

import fetch from 'isomorphic-fetch';

const API_BASE_PATH = 'https://api-gfx-track.herokuapp.com/';

export const REQUEST_VIDEO_CARDS = 'REQUEST_VIDEO_CARDS';
export const RECEIVE_VIDEO_CARDS = 'RECEIVE_VIDEO_CARDS';

const requestVideoCards = () => ({
  type: REQUEST_VIDEO_CARDS
});

const receiveVideoCards = list => ({
  type: RECEIVE_VIDEO_CARDS,
  list
});

export const fetchVideoCards = () =>
  dispatch => {
    dispatch(requestVideoCards());
    return fetch(`${API_BASE_PATH}/video-cards`)
      .then(response => response.json())
      .then(videoCards => dispatch(receiveVideoCards(videoCards)));
  };
