import './styles/app.scss';

import Vue from 'vue';
import Invoice from './components/invoice/Invoice.vue'

/*import Main from './components/Main.jsx'
import Receiver from './components/Receiver.jsx'
import Amount from './components/Amount.jsx'
import Invoice from './components/Invoice.jsx'
import {createRouter} from './bootstrap'

import {dom, element} from 'deku'
import { createHistory } from 'history'

let routes = [
    { component: Main, path: '/'},
    { component: Receiver, path: '/receiver'},
    { component: Amount, path: '/amount'},
    { component: Invoice, path: '/invoice'}
];

createRouter(routes, 'navigate', 'main');
*/
new Vue({
    el: '#main',
    render: h => h(Invoice)
});