<template>
    <div id="app">

        <div id="main">

            <div class="lg-col-2">&nbsp;</div>
            <div class="lg-col-8">


                <div id="navigate" v-bind:class="{ 'layout-sidebar': !loggedIn, 'layout-sidebar--loggedin': loggedIn }">

                    <div class="layout-sidebar__item">
                        <router-link class="layout-sidebar__item__link" to="/invoice">Fakturera</router-link>
                    </div>
                    <div class="layout-sidebar__item">
                        <router-link class="layout-sidebar__item__link" to="/invoices">Mina fakturor</router-link>
                    </div>
                    <div v-if="loggedIn" class="layout-sidebar__item">
                        <a class="layout-sidebar__item__link" href="" v-on:click="logout">Logga ut</a>
                    </div>
                </div>


                <router-view></router-view>
            </div>
            <div class="lg-col-2">&nbsp;</div>
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