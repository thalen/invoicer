import {combineReducers} from "redux";
import router from "./router";
import invoice from "./invoice";
import customer from "./customer";

const rootReducer = combineReducers({
    router,
    invoice,
    customer
});

export default rootReducer;
