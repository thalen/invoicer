import {createStore, applyMiddleware} from 'redux'
import rootReducer from './reducers'
import thunkMiddleware from 'redux-thunk'
import {createLogger} from 'redux-logger'
import {createEpicMiddleware, combineEpics} from 'redux-observable';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/dom/ajax';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';

import Vue from 'vue'
import Revue from 'revue'

const loggerMiddleware = createLogger();

const pdfCreated = payload => ({ type: 'PREVIEW', payload });
const previewEpic = action$ =>
    action$.ofType('PREVIEW_INIT')
        .debounceTime(500)
        .mergeMap(action =>
        {
            return Observable.ajax({
                method: 'POST',
                url: 'http://localhost:5000/api/pdf/create',
                body: {
                    'hours': action.model.hours,
                    'price': action.model.price,
                    'dueDate': action.model.dueDate,
                    'invoiceMonth': action.model.invoiceMonth
                },
            }).map(pdfCreated);
        }

        );

const linkRemoved = payload => ({ type: 'LINK_REMOVED', payload});
const deleteTempFile = action$ =>
    action$.ofType('REMOVE_LINK')
        .debounceTime(500)
        .mergeMap(action =>
        {
            return Observable.ajax({
                method: 'DELETE',
                url: `http://localhost:5000/api/pdf/${action.asset}`
            }).map(linkRemoved);
        });

const epicMiddleware = createEpicMiddleware(combineEpics(previewEpic, deleteTempFile));

let store;
function configureStore(initialState) {

    const createStoreWithMiddleware = applyMiddleware(
        thunkMiddleware,
        loggerMiddleware,
        epicMiddleware
    )(createStore);

    let reduxStore = createStoreWithMiddleware(rootReducer);
    store = new Revue(Vue, reduxStore, {});
}
export function getStore() {
    if (store === void 0) {
        configureStore();
    }
    return store;
}
