import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
// brace is required by our code editor
// eslint-disable-next-line
import brace from 'brace';
import 'brace/mode/javascript';
import 'brace/mode/python';
import 'brace/theme/monokai';
import 'brace/theme/xcode';
import Root from './components/Root';
import configureStore from './store/configureStore';
import './index.css';

const root = document.getElementById('root');

const renderApp = (RootComponent, store) => {
  render(
    <Provider store={store}>
      <RootComponent />
    </Provider>,
    root
  );
};

// render app to the dom
const { store, history } = configureStore();

renderApp(Root, store, history);

if (module.hot) {
  module.hot.accept('./components/Root', () => {
    // eslint-disable-next-line global-require
    const NextRoot = require('./components/Root').default;
    renderApp(NextRoot, store, history);
  });
}
