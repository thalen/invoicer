/** @jsx element */
import {element,createApp} from 'deku'
import {createStore} from 'redux'
import {reducer} from './reducer'
import './styles/app.scss';

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
);