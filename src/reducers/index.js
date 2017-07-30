import {combineReducers} from 'redux'
import router from './router'
import invoice from './invoice';

const rootReducer = combineReducers({
    router,
    invoice
});

export default rootReducer
