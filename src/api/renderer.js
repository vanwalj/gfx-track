'use strict';

const React = require('react');
const redux = require('redux');
const reactRedux = require('react-redux');
const reactDomServer = require('react-dom/server');
const Provider = reactRedux.Provider;
const orm = require('./orm');

const App = require('../app/src/components/app').default;
const reducer = require('../app/src/reducers').default;

const renderFullPage = (html, initialState) => `
  <!DOCTYPE html>
  <html>
  <head>
      <meta http-equiv="Content-type" content="text/html; charset=utf-8"/>
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=0, maximum-scale=1, minimum-scale=1">
      <title>GFX Track - GTX 1080 Edition.</title>
      <link href='https://fonts.googleapis.com/css?family=Roboto:400,300,500' rel='stylesheet' type='text/css'>
      <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
      <style>
          html { font-family: 'Roboto', sans-serif; }
          body { font-size: 13px; line-height: 20px; margin: 0; }
      </style>
  </head>
    <body>
        <div id="root">${html}</div>
        <script>
          window.__INITIAL_STATE__ = ${JSON.stringify(initialState)}
        </script>
        <script src="/static/bundle.js"></script>
    </body>
  </html>
`;


module.exports = () => async ctx => {
  const initialState = {
    videoCards: {
      list: await orm.models.VideoCard.findAll()
    }
  };
  const store = redux.createStore(reducer, initialState);
  const html = reactDomServer.renderToString(
    <Provider store={store}>
      <App userAgent={ctx.get('user-agent')} />
    </Provider>
  );
  const finalState = store.getState();
  ctx.body = renderFullPage(html, finalState);
};
