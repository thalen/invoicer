import './styles/app.scss';

import Vue from 'vue';
import Invoice from './components/invoice/Invoice.vue'

new Vue({
    el: '#main',
    render: h => h(Invoice)
});