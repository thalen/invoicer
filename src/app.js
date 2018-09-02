import "babel-polyfill";
import "vuetify/dist/vuetify.min.css";
import "./styles/app.scss";

import Vue from "vue";
import Vuetify from "vuetify";
import VueRouter from "vue-router";
import Invoice from "./components/invoice/Invoice.vue";
import invoices from "./components/invoices/invoices.vue";
import LoginForm from "./components/login/LoginForm.vue";
import app from "./components/app/app.vue";
import { getStore } from "./configureStore";

Vue.use(VueRouter);
Vue.use(Vuetify);

const routes = [
  { path: "", component: Invoice, name: "home" },
  { path: "/invoice", component: Invoice, name: "invoice" },
  { path: "/invoices", component: invoices, name: "invoices" },
  { path: "/login", component: LoginForm, name: "login" }
];
const router = new VueRouter({
  routes
});
const store = getStore();
router.beforeEach((to, from, next) => {
  if (!store.state.router.loggedIn && to.name !== "login") {
    next("/login");
  } else {
    next();
  }
});

new Vue({
  router: router,
  el: "#app",
  render: h => h(app)
});
