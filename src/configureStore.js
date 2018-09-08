import {createStore, applyMiddleware, compose} from "redux";
import rootReducer from "./reducers";
import thunkMiddleware from "redux-thunk";
import {createLogger} from "redux-logger";
import {createEpicMiddleware, combineEpics} from "redux-observable";
import {Observable} from "rxjs/Observable";
import "rxjs/add/observable/dom/ajax";
import "rxjs/add/observable/of";
import "rxjs/add/operator/debounceTime";
import "rxjs/add/operator/map";
import "rxjs/add/operator/mergeMap";
import "rxjs/add/operator/catch";

import Vue from "vue";
import Revue from "revue";
import authenticationProvider from "./services/authenticationProvider";

const loggerMiddleware = createLogger();

const pdfCreated = payload => ({type: "PREVIEW", payload});
const previewEpic = action$ =>
    action$
        .ofType("PREVIEW_INIT")
        .debounceTime(500)
        .mergeMap(action => {
            return Observable.ajax(
                authenticationProvider({
                    method: "POST",
                    url: "/api/pdf/preview",
                    body: {
                        hours: action.model.hours,
                        price: action.model.price,
                        dueDate: action.model.dueDate,
                        invoiceMonth: action.model.invoiceMonth
                    }
                })
            ).map(pdfCreated);
        });

const linkRemoved = payload => ({type: "LINK_REMOVED", payload});
const deleteTempFile = action$ =>
    action$
        .ofType("REMOVE_LINK")
        .debounceTime(500)
        .mergeMap(action => {
            return Observable.ajax(
                authenticationProvider({
                    method: "DELETE",
                    url: `/api/pdf/${action.asset}`
                })
            ).map(linkRemoved);
        });

const invoiceSaved = payload => ({type: "INVOICE_SAVED", payload});
const saveInvoice = action$ =>
    action$
        .ofType("SAVE_INVOICE")
        .debounceTime(500)
        .mergeMap(action => {
            return Observable.ajax(
                authenticationProvider({
                    method: "POST",
                    url: `/api/pdf/create/${action.pdf}`,
                    body: {
                        ocr: action.ocr
                    }
                })
            ).map(invoiceSaved);
        });

const invoicesLoaded = payload => ({type: "INVOICES_LOADED", payload});
const loadInvoices = action$ =>
    action$
        .ofType("LOAD_INVOICES")
        .debounceTime(500)
        .mergeMap(action => {
            return Observable.ajax(
                authenticationProvider({
                    method: "GET",
                    url: "/api/invoices"
                })
            ).map(invoicesLoaded);
        });

const loginDone = payload => ({type: "AUTHENTICATED", payload});
const authenticate = action$ =>
    action$
        .ofType("AUTHENTICATE")
        .debounceTime(500)
        .mergeMap(action => {
            return Observable.ajax({
                method: "POST",
                url: "/authenticate",
                body: {
                    user_id: action.user,
                    password: action.password
                }
            })
                .map(loginDone)
                .catch(error =>
                    Observable.of({
                        type: "INVALID_CREDENTIALS",
                        payload: error.xhr.response
                    })
                );
        });

const epicMiddleware = createEpicMiddleware(
    combineEpics(
        previewEpic,
        deleteTempFile,
        saveInvoice,
        loadInvoices,
        authenticate
    )
);

let store;

function configureStore(initialState) {

    const middleware = [
        thunkMiddleware,
        loggerMiddleware,
        epicMiddleware
    ];
    const composeEnhancers =
        typeof window === 'object' &&
        window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ?
            window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
                // Specify extension’s options like name, actionsBlacklist, actionsCreators, serialize...
            }) : compose;

    const enhancer = composeEnhancers(
        applyMiddleware(...middleware)
    );

    let reduxStore = createStore(rootReducer, enhancer);
    store = new Revue(Vue, reduxStore, {});
}

export function getStore() {
    if (store === void 0) {
        configureStore();
    }
    return store;
}
