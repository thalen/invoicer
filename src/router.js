import Vue from 'vue'
import Router from 'vue-router'

import Invoice from "./components/invoice/Invoice.vue";
import invoices from "./components/invoices/invoices.vue";
import LoginForm from "./components/login/LoginForm.vue";
import Settings from "./containers/settings.vue";

import { getStore } from "./configureStore";

Vue.use(Router)

const router = new Router({
  routes: [
      { path: "", component: Invoice, name: "home" },
      { path: "/invoice", component: Invoice, name: "invoice" },
      { path: "/invoices", component: invoices, name: "invoices" },
      { path: "/login", component: LoginForm, name: "login" },
      { path: "/settings", component: Settings, name: "settings" }
  ]
});
const store = getStore();
router.beforeEach((to, from, next) => {
    if (!store.state.router.loggedIn && to.name !== "login") {
        next("/login");
    } else {
        next();
    }
});

export default router;
