<template>
    <div id="app">
        <!--
        <div class="layout-top">
            <h1>Hantering av mina fakturor</h1>
        </div>
        -->
        <div id="navigate" v-bind:class="{ 'layout-sidebar': !loggedIn, 'layout-sidebar--loggedin': loggedIn }">

            <div class="layout-sidebar__item1">
                <router-link to="/invoice">Fakturera</router-link>
            </div>
            <div class="layout-sidebar__item2">
                <router-link to="/invoices">Mina fakturor</router-link>
            </div>
            <div v-if="loggedIn" class="layout-sidebar__item3">
                <a href="" v-on:click="logout">Logga ut</a>
            </div>
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