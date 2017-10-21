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
import invoice from "./reducers/invoice";

const loggerMiddleware = createLogger();

const pdfCreated = payload => ({ type: 'PREVIEW', payload });
const previewEpic = action$ =>
    action$.ofType('PREVIEW_INIT')
        .debounceTime(500)
        .mergeMap(action =>
        {
            return Observable.ajax({
                method: 'POST',
                url: '/api/pdf/preview',
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
                url: `/api/pdf/${action.asset}`
            }).map(linkRemoved);
        });

const invoiceSaved = payload => ({ type: 'INVOICE_SAVED', payload});
const saveInvoice = action$ =>
    action$.ofType('SAVE_INVOICE')
        .debounceTime(500)
        .mergeMap(action =>
        {
            return Observable.ajax({
                method: 'POST',
                url: `/api/pdf/create/${action.pdf}`,
                body: {
                    'ocr': action.ocr
                }
            }).map(invoiceSaved);
        });

const invoicesLoaded = payload => ({ type: 'INVOICES_LOADED', payload});
const loadInvoices = action$ =>
    action$.ofType('LOAD_INVOICES')
        .debounceTime(500)
        .mergeMap(action =>
        {
            return Observable.ajax({
                method: 'GET',
                url: '/api/invoices'
            }).map(invoicesLoaded);
        });

const epicMiddleware = createEpicMiddleware(combineEpics(previewEpic, deleteTempFile, saveInvoice, loadInvoices));

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
