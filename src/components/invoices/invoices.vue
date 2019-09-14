<template>
    <v-flex xs12>
    <div class="invoices">
        <h3 class="invoices__header">Alla fakturor</h3>
        <table>
            <tbody>
            <tr>
                <th>
                    Namn
                </th>
                <th class="invoices__table-align">
                    Skapad
                </th>
            </tr>
            <tr v-bind:key="item.id" v-for="item in invoices">
                <td>{{item.label}}</td>
                <td class="invoices__table-align">{{item.created}}</td>
            </tr>
            </tbody>
        </table>
    </div>
    </v-flex>
</template>
<script>
import './invoices.scss';
import { getStore } from '../../store';
let store = getStore();
export default {
  data() {
    return {
      invoices: this.$select('invoice.invoices as invoices')
    };
  },
  created() {
    // fetch the data when the view is created and the data is
    // already being observed
    this.fetchData();
  },
  methods: {
    fetchData() {
      store.dispatch({
        type: 'LOAD_INVOICES'
      });
    }
  }
};
</script>
