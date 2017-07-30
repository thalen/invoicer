import './styles/app.scss';

import Main from './components/Main.jsx'
import Receiver from './components/Receiver.jsx'
import Amount from './components/Amount.jsx'
import Invoice from './components/Invoice.jsx'
import {createRouter} from './bootstrap'

import {dom, element} from 'deku'
import { createHistory } from 'history'
import configureStore from './configureStore'

let store = configureStore();

let routes = [
    { component: Main, path: '/'},
    { component: Receiver, path: '/receiver'},
    { component: Amount, path: '/amount'},
    { component: Invoice, path: '/invoice'}
];

//let renderNav = dom.createRenderer(document.getElementById('main'), store.dispatch);
//renderNav(<Main />, store.getState());

createRouter(routes, 'navigate', 'main');

/*
// Dispatch an action when the button is clicked 
let log = dispatch => event => {
    dispatch({
        type: 'CLICKED'
    })
};

// Define a state-less component 
let MyButton = {
        render: ({ props, children, dispatch }) => {
        return <button onClick={log(dispatch)}>{children}</button>
    }
};

// Create a Redux store to handle all UI actions and side-effects 
let store = createStore(reducer);

// Create an app that can turn vnodes into real DOM elements 
let render = createApp(document.getElementById('root'), store.dispatch);

// Update the page and add redux state to the context 
render(
<MyButton>Hello World!</MyButton>,
    store.getState()
);

store.subscribe(() =>
    console.log(store.getState())
);*/