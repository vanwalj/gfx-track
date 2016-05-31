'use strict';

import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import Layout from './layout';
import { fetchVideoCards, registerEmail } from '../actions';

class App extends Component {
  render () {
    const { videoCards, registration, userAgent = navigator.userAgent, dispatch } = this.props;

    return (<Layout videoCards={videoCards} registration={registration} userAgent={userAgent} touchedNotificationButton={email => dispatch(registerEmail(email, videoCards))} />);
  }
}

export default connect(({ videoCards, registration }) => ({ videoCards, registration }))(App);
