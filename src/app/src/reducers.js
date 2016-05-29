'use strict';

import { combineReducers } from 'redux'

import {
  RECEIVE_GFX, REQUEST_GFX
} from './actions'

const gfx = (state = { isFetching: false, list: [], failed: false }, action) => {
  switch (action.type) {
    case REQUEST_GFX:
      return {
        ...state,
        isFetching: true
      };
    case RECEIVE_GFX:
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
  gfx
});
