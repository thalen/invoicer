<template>
  <div id="app">

    <v-app>
      <div id="main">

        <div class="lg-col-2">&nbsp;</div>
        <div class="lg-col-8">


          <div id="navigate" class="layout-sidebar" v-if="loggedIn">

            <div class="layout-sidebar__item">
              <router-link class="layout-sidebar__item__link" to="/invoice">Fakturera</router-link>
              <!--
              <v-menu offset-y>
                <v-btn
                        slot="activator"
                        color="primary"
                        dark
                >
                  Fakturera
                </v-btn>
                <v-list>
                  <v-list-tile
                          @click=""
                  >
                    <v-list-tile-title>Skapa faktura</v-list-tile-title>
                  </v-list-tile>
                  <v-list-tile @click="">
                    <v-list-tile-title>Inställningar</v-list-tile-title>
                  </v-list-tile>
                </v-list>
              </v-menu>
              -->
            </div>
            <div class="layout-sidebar__item">
              <router-link class="layout-sidebar__item__link" to="/invoices">Mina fakturor</router-link>
            </div>
            <div class="layout-sidebar__item">
              <a class="layout-sidebar__item__link" href="" v-on:click="logout">Logga ut</a>
            </div>
          </div>
          <router-view></router-view>
        </div>
        <div class="lg-col-2">&nbsp;</div>
      </div>
    </v-app>
  </div>
</template>
<script>
    import { getStore } from "./configureStore";

    const store = getStore();
    export default {
        name: "App",
        data() {
            return {
                loggedIn: this.$select("router.loggedIn as loggedIn")
            };
        },
        methods: {
            logout() {
                store.dispatch({
                    type: "LOGOUT"
                });
                this.$router.push("login");
            }
        }
    };
</script>
