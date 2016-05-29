'use strict';

import injectTapEventPlugin from 'react-tap-event-plugin';

injectTapEventPlugin();

import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux'

import configureStore from './store';

import App from './components/app';

const store = configureStore();

class Root extends React.Component {
  render () {
    return (
      <Provider store={store}>
        <App/>
      </Provider>
    );
  }
}

ReactDOM.render(<Root/>, document.getElementById('app'));
