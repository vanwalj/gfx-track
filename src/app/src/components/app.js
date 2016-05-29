'use strict';

import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import Layout from './layout';
import { fetchVideoCards } from '../actions';

class App extends Component {
  constructor (props) {
    super(props);
    this.state = {
      drawerIsOpen: false
    };
    this.toggleDrawer = this.toggleDrawer.bind(this);
  }
  toggleDrawer () {
    this.setState({ drawerIsOpen: !this.state.drawerIsOpen });
  }
  render () {
    const { videoCards, userAgent = navigator.userAgent } = this.props;

    return (<Layout
      videoCards={videoCards}
      userAgent={userAgent}
      toggleDrawer={this.toggleDrawer}
      drawerIsOpen={this.state.drawerIsOpen}
    />);
  }
}

const mapStateToProps = ({ videoCards }) => ({ videoCards });

export default connect(mapStateToProps)(App);
