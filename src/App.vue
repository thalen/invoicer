<template>
  <div id="app">

    <v-app>
      <v-navigation-drawer
              v-if="loggedIn"
              v-model="drawer"
              fixed
              app
      >
        <v-list dense>
          <v-list-tile @click="goto('invoice')">
            <v-list-tile-action>
              <v-icon>money</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>Skapa faktura</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
          <v-list-tile @click="goto('invoices')">
            <v-list-tile-action>
              <v-icon>format_align_justify</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>Mina fakturor</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
          <v-list-tile @click="goto('settings')">
            <v-list-tile-action>
              <v-icon>person_pin</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>Lägg till kund</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
          <v-list-tile @click="logout()">
            <v-list-tile-action>
              <v-icon>stop</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>Logga ut</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list>
      </v-navigation-drawer>
      <v-toolbar color="indigo" dark fixed app>
        <v-toolbar-side-icon v-if="loggedIn" @click.stop="drawer = !drawer"></v-toolbar-side-icon>
        <v-toolbar-title>Invoicer</v-toolbar-title>
      </v-toolbar>
      <v-content>
        <v-container fluid fill-height>
          <v-layout
                  row wrap
          >
            <router-view></router-view>

          </v-layout>
        </v-container>
      </v-content>
      <v-footer color="indigo" app>
        <span class="white--text">&copy; 2019 Thalen solutions AB</span>
      </v-footer>
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
                loggedIn: this.$select("router.loggedIn as loggedIn"),
                drawer: null
            };
        },
        methods: {
            logout() {
                store.dispatch({
                    type: "LOGOUT"
                });
                this.$router.push("login");
            },
            goto(route) {
                this.$router.push(route);
            }
        }
    };
</script>
