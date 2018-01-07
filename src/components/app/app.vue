<template>
    <div id="app">
        <div class="layout-top">
            <h1>Hantering av mina fakturor</h1>
        </div>
        <div id="navigate" class="layout-sidebar">
            <ul>
                <li>
                    <router-link to="/invoice">Fakturera</router-link>
                </li>
                <li>
                    <router-link to="/invoices">Mina fakturor</router-link>
                </li>
                <li v-if="loggedIn">
                    <a href="" v-on:click="logout">Logga ut</a>
                </li>
            </ul>
        </div>
        <div id="main" class="layout-main">
            <router-view></router-view>
        </div>
    </div>
</template>
<script>
    import {getStore} from '../../configureStore';
    const store = getStore();
    export default {
        name: 'app',
        data () {
            return {
                loggedIn: this.$select('router.loggedIn as loggedIn')
            }
        },
        methods: {
            logout() {
                store.dispatch({
                    type: 'LOGOUT'
                });
                this.$router.push('login');
            }
        }
    }
</script>