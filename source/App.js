import React from 'react';
import '@babel/polyfill';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import KanbanBoardContainer from './components/KanbanBoardContainer';
import { store } from './store/initStore';

const app = (
  <Provider store={store}>
    <KanbanBoardContainer />
  </Provider>
);

render(app, document.getElementById('root'));
