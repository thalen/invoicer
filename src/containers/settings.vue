<template>
    <v-flex xs12>
        <div>
            <v-tabs
                    color="light-green"
                    dark
                    slider-color="teal"
            >
                <v-tab
                        v-for="(item, index) in items"
                        :key="index"
                        ripple
                >
                    {{ item.title }}

                </v-tab>
                <v-tab-item>
                    <v-card flat>
                        <CustomerForm />
                    </v-card>
                </v-tab-item>
                <v-tab-item>
                    <v-card flat>
                        <CustomerList />
                    </v-card>
                </v-tab-item>
            </v-tabs>


        </div>
    </v-flex>
</template>

<script>
import './settings.scss';
import CustomerList from '../components/customers/CustomerList.vue';
import CustomerForm from '../components/customers/CustomerForm.vue';

export default {
  name: 'settings',
  data() {
    return {
      items: [{ title: 'Skapa ny kund' }, { title: 'Redigera befintlig kund' }]
    };
  },
  methods: {},
  components: {
    CustomerList,
    CustomerForm
  }
};
</script>
