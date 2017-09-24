import './styles/app.scss';

import Vue from 'vue';
import VueRouter from 'vue-router';
import Invoice from './components/invoice/Invoice.vue';
import invoices from './components/invoices/invoices.vue';
import app from './components/app/app.vue';

Vue.use(VueRouter);

const routes = [
    { path: '', component: Invoice },
    { path: '/invoice', component: Invoice },
    { path: '/invoices', component: invoices }
];
const router = new VueRouter({
    routes
});

new Vue({
    router: router,
    el: '#app',
    render: h => h(app)
});