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
                    url: `/api/customer/${action.model.customer}/invoice/preview`,
                    body: {
                        hours: action.model.hours,
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
                    url: `/api/pdf/create/${action.pdf}?customerId=${action.customerId}`,
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

const customerCreated = payload => ({type: "CREATE_CUSTOMER_DONE", payload});
const createCustomer = action$ =>
    action$
        .ofType("CREATE_CUSTOMER")
        .debounceTime(500)
        .mergeMap(action => {
            return Observable.ajax(
                authenticationProvider({
                    method: "POST",
                    url: "/api/customer",
                    body: {
                        ...action.form
                    }
                })
            ).map(customerCreated)
                .catch(error =>
                    Observable.of({
                        type: "CREATE_CUSTOMER_FAILED",
                        payload: error.xhr.response
                    })
                );
        });

const getCustomersDone = payload => ({type: "LIST_CUSTOMERS_DONE", payload});
const getCustomers = action$ =>
    action$
        .ofType("LIST_CUSTOMERS")
        .debounceTime(500)
        .mergeMap(action => {
            return Observable.ajax(
                authenticationProvider({
                    method: "GET",
                    url: `/api/customers?user_id=${action.user}`
                })
            ).map(getCustomersDone)
                .catch(error =>
                    Observable.of({
                        type: "LIST_CUSTOMERS_FAILED",
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
        authenticate,
        createCustomer,
        getCustomers
    )
);

let store;

function configureStore(initialState) {

    const devMiddleware = [
        thunkMiddleware,
        loggerMiddleware,
        epicMiddleware
    ];
    const prodMiddleware = [
        thunkMiddleware,
        epicMiddleware
    ];
    const middleware = process.env.NODE_ENV === 'development' ? devMiddleware : prodMiddleware;
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
