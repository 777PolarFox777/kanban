import createSagaMiddleware from 'redux-saga';
import { applyMiddleware, compose, createStore } from 'redux';
import mainReducer from './mainReducer';
import mainSaga from './mainSaga';

export const initialState = {
  kanbanReducer: {
    cards: [],
    user: '',
    isLoading: true,
  },
};

const initStore = (initState) => {
  const sagaMiddleware = createSagaMiddleware();

  const store = createStore(
    mainReducer,
    initState,
    compose(
      applyMiddleware(
        // middlewares go here
        sagaMiddleware,
      ),
      window.__REDUX_DEVTOOLS_EXTENSION__ // eslint-disable-line no-underscore-dangle
        ? window.__REDUX_DEVTOOLS_EXTENSION__() // eslint-disable-line no-underscore-dangle
        : f => f,
    ),
  );

  sagaMiddleware.run(mainSaga);

  return store;
};

export const store = initStore(initialState);
