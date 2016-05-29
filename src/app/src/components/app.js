'use strict';

import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import Layout from './layout';
import { fetchGFX } from '../actions';

class App extends Component {
  componentDidMount () {
    const { dispatch } = this.props;

    dispatch(fetchGFX());
  }
  render () {
    const { gfx } = this.props;

    return (<Layout gfx={gfx} />);
  }
}

const mapStateToProps = ({ gfx }) => ({ gfx });

export default connect(mapStateToProps)(App);
