'use strict';

import fetch from 'isomorphic-fetch';

const API_BASE_PATH = '';

export const REQUEST_VIDEO_CARDS = 'REQUEST_VIDEO_CARDS';
export const RECEIVE_VIDEO_CARDS = 'RECEIVE_VIDEO_CARDS';
export const TOGGLE_NOTIFICATIONS = 'TOGGLE_NOTIFICATIONS';
export const START_EMAIL_REGISTRATION = 'START_EMAIL_REGISTRATION';
export const EMAIL_REGISTERED = 'EMAIL_REGISTERED';

const requestVideoCards = () => ({
  type: REQUEST_VIDEO_CARDS
});

const receiveVideoCards = list => ({
  type: RECEIVE_VIDEO_CARDS,
  list
});

const completeEmailRegistration = () => ({
  type: EMAIL_REGISTERED
});

const startEmailRegistration = () => ({
  type: START_EMAIL_REGISTRATION
});

export const registerEmail = (email, videoCards) =>
  dispatch => {
    dispatch(startEmailRegistration());
    return fetch(`${API_BASE_PATH}/register`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email,
        videoCardIds: videoCards.list.filter(videoCard => videoCard.notificationsEnabled).map(videoCard => videoCard.id)
      })
    })
      .then(() => dispatch(completeEmailRegistration()))
  };

export const toggleNotifications = videoCard => ({
  type: TOGGLE_NOTIFICATIONS,
  videoCard
});

export const fetchVideoCards = () =>
  dispatch => {
    dispatch(requestVideoCards());
    return fetch(`${API_BASE_PATH}/video-cards`)
      .then(response => response.json())
      .then(videoCards => dispatch(receiveVideoCards(videoCards)));
  };
