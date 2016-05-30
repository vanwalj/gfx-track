'use strict';

import injectTapEventPlugin from 'react-tap-event-plugin';

injectTapEventPlugin();

import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Router, Route, browserHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';

import configureStore from './store';

import App from './components/app';

const initialState = window['__INITIAL_STATE__'];
const store = configureStore(initialState);
const history = syncHistoryWithStore(browserHistory, store);

const Root = () => (
  <Provider store={store}>
    <Router history={history}>
      <Route path="/" component={App} />
    </Router>
  </Provider>
);

ReactDOM.render(<Root/>, document.getElementById('root'));
