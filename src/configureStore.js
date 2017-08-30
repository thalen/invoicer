import {createStore, applyMiddleware} from 'redux'
import rootReducer from './reducers'
import thunkMiddleware from 'redux-thunk'
import {createLogger} from 'redux-logger'
import {createEpicMiddleware} from 'redux-observable';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/dom/ajax';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';

const loggerMiddleware = createLogger();

const pdfCreated = payload => ({ type: 'PREVIEW', payload });
const previewEpic = action$ =>
    action$.ofType('PREVIEW_INIT')
        .debounceTime(500)
        .mergeMap(action =>
        {
            console.log(action.model);
            return Observable.ajax({
                method: 'POST',
                url: 'http://localhost:5000/api/pdf/create',
                body: {
                    'hours': action.model.hours,
                    'price': action.model.price,
                    'dueDate': action.model.dueDate
                },
            }).map(pdfCreated);
        }

        );

const epicMiddleware = createEpicMiddleware(previewEpic);

export default function configureStore(initialState) {

    const createStoreWithMiddleware = applyMiddleware(
        thunkMiddleware,
        loggerMiddleware,
        epicMiddleware
    )(createStore);

    const store = createStoreWithMiddleware(rootReducer);

    return store;
}
