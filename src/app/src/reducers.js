'use strict';

import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

import {
  RECEIVE_VIDEO_CARDS, REQUEST_VIDEO_CARDS, TOGGLE_NOTIFICATIONS,
  EMAIL_REGISTERED, START_EMAIL_REGISTRATION
} from './actions'

const videoCards = (state = { isFetching: false, list: [], failed: false }, action) => {
  switch (action.type) {
    case TOGGLE_NOTIFICATIONS:
      return {
        ...state,
        list: state.list
          .map(
            videoCard =>
              videoCard.id === action.videoCard.id ?
              { ...videoCard, notificationsEnabled: !videoCard.notificationsEnabled } :
                videoCard)
      };
    case REQUEST_VIDEO_CARDS:
      return {
        ...state,
        isFetching: true
      };
    case RECEIVE_VIDEO_CARDS:
      return {
        ...state,
        isFetching: false,
        list: action.list
      };
    default:
      return state;
  }
};

const registration = (state = { isFetching: false, isComplete: false }, action) => {
  switch (action.type) {
    case START_EMAIL_REGISTRATION:
      return {
        ...state,
        isFetching: true
      };
    case EMAIL_REGISTERED:
      return {
        ...state,
        isFetching: false,
        isComplete: true
      };
    default:
      return state;
  }
};

export default combineReducers({
  registration,
  videoCards,
  routing: routerReducer
});
