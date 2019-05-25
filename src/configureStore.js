import { createStore, applyMiddleware, compose } from 'redux';
import rootReducer from './reducers';
import thunkMiddleware from 'redux-thunk';
import { createLogger } from 'redux-logger';
import 'rxjs/add/observable/dom/ajax';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/catch';

import Vue from 'vue';
import Revue from 'revue';

import epicMiddleware from './epics';

const loggerMiddleware = createLogger();

let store;

function configureStore() {
  const devMiddleware = [thunkMiddleware, loggerMiddleware, epicMiddleware];
  const prodMiddleware = [thunkMiddleware, epicMiddleware];
  const middleware = process.env.NODE_ENV === 'development' ? devMiddleware : prodMiddleware;
  const composeEnhancers =
    typeof window === 'object' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
      ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
          // Specify extension’s options like name, actionsBlacklist, actionsCreators, serialize...
        })
      : compose;

  const enhancer = composeEnhancers(applyMiddleware(...middleware));

  let reduxStore = createStore(rootReducer, enhancer);
  store = new Revue(Vue, reduxStore, {});
}

export function getStore() {
  if (store === void 0) {
    configureStore();
  }
  return store;
}

const actionCreator = fn => {
  const store = getStore();
  const getState = () => store.state;
  return fn(store.dispatch.bind(store), getState);
};

export { actionCreator };
