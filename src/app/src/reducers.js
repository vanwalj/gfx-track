'use strict';

import { combineReducers } from 'redux'

import {
  RECEIVE_VIDEO_CARDS, REQUEST_VIDEO_CARDS
} from './actions'

const videoCards = (state = { isFetching: false, list: [], failed: false }, action) => {
  switch (action.type) {
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

export default combineReducers({
  videoCards
});
