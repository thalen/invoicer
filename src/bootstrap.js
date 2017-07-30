import {dom, element} from 'deku'
import { createHistory } from 'history'
import configureStore from './configureStore'
import Nav from './components/Nav.jsx'

let store = configureStore();

let routes = [];
let renderNav = null;
let renderMain = null;
let history = null;

export function createRouter (appRoutes, idNav, idMain) {

    let nav = document.getElementById(idNav);
    let main = document.getElementById(idMain);

    // set the routes
    routes = appRoutes;

    // Creating renderer
    renderNav = dom.createRenderer(nav, store.dispatch);
    renderMain = dom.createRenderer(main, store.dispatch);

    renderNav(<Nav />, store.getState());

    // setup History listener
    setupHistory();

    // subscribe to store changes
    store.subscribe(() => updateStore());

}


function updateStore() {
    console.log("updateStore");
    console.log(store.getState());
    //renderApplication();
}


function renderApplication() {
    console.log(location.pathname);
    let Component = matchPath(location.pathname);
    renderMain(<Component />, store.getState());
}

function matchPath (path) {
    let component = null;

    routes.map(m => {
        if(m.path === path){
            component = m.component
        }
    });

    console.log(component);
    return component;
}

/* listen for a change of route, and update the container */
export function setupHistory () {

    history = createHistory();

    let unlisten = history.listen(location => {

        // we have navigated to a component via back button, or initial page load
        console.log('u loaded, now load a container');
        renderApplication();

    })

}

export function link (path, Component) {
    return () => {
        history.push({
            pathname: path
        })
    }
}