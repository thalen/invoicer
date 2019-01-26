<template>
    <v-flex xs12>
        <div class="invoice">
            <h3>Registrera faktura</h3>
            <fieldset class="invoice__form">
                <p>Fyll i fakturauppgifterna nedan för att skapa din faktura</p>

                <form>
                    <p>
                        <label for="customer">Kund</label>
                        <select id="customer" v-model="selectedCustomer">
                            <option v-for="customer in customers" v-bind:value="customer.id">
                                {{customer.name}}
                            </option>
                        </select>

                    </p>
                    <p>
                        <label for="hours">Antal timmar</label>
                        <input v-model="form.hours" type="text" id="hours">
                    </p>

                    <p>
                        <label for="dueDate">Förfallodatum</label>
                        <input v-model="form.dueDate" type="date" id="dueDate">
                    </p>

                    <p>
                        <label for="invoiceMonth">Månad</label>
                        <select id="invoiceMonth" v-model="form.invoiceMonth">
                            <option value="">Välj en månad</option>
                            <option value="Januari">Januari</option>
                            <option value="Februari">Februari</option>
                            <option value="Mars">Mars</option>
                            <option value="April">April</option>
                            <option value="Maj">Maj</option>
                            <option value="Juni">Juni</option>
                            <option value="Juli">Juli</option>
                            <option value="Augusti">Augusti</option>
                            <option value="September">September</option>
                            <option value="Oktober">Oktober</option>
                            <option value="November">November</option>
                            <option value="December">December</option>
                        </select>
                    </p>
                    <p>
                        <input v-on:click="doPreview" type="submit" value="Skapa faktura"/>
                    </p>
                </form>
            </fieldset>
            <v-alert v-if="showPdf"
                    :value="true"
                    type="success"
            >
                <b>Fakturan är laddad</b>
            </v-alert>
            <div v-if="showPdf">
                <v-btn color="info" style="margin-left:0">Förhandsgranska</v-btn>
                <v-btn color="info">Spara</v-btn>
            </div>
        </div>
    </v-flex>
</template>

<script>
import './invoice.scss';
import { getStore } from '../../configureStore';

let store = getStore();
export default {
    name: 'invoice',
    data() {
        return {
            form: {
                invoiceMonth: ''
            },
            showPdf: this.$select('invoice.showPdf as showPdf'),
            pdfLink: this.$select('invoice.pdfLink as pdfLink'),
            ocr: this.$select('invoice.ocr as ocr'),
            customers: this.$select('customer.customers as customers'),
            selectedCustomer: undefined
        };
    },
    methods: {
        doPreview(event) {
            event.preventDefault();
            if (this.pdfLink !== void 0 && this.pdfLink !== null) {
                let arr = this.pdfLink.split('/');
                store.dispatch({
                    type: 'REMOVE_LINK',
                    asset: arr[arr.length - 1]
                });
            }
            store.dispatch({
                type: 'PREVIEW_INIT',
                model: {
                    customer: this.selectedCustomer,
                    hours: this.form.hours,
                    dueDate: this.form.dueDate,
                    invoiceMonth: this.form.invoiceMonth
                }
            });
            this.form = {
                invoiceMonth: ''
            };
            this.selectedCustomer = undefined;
        },
        doSave(event) {
            event.preventDefault();
            let arr = this.pdfLink.split('/');
            store.dispatch({
                type: 'SAVE_INVOICE',
                pdf: arr[arr.length - 1],
                ocr: this.ocr,
                customerId: store.state.customer.selectedCustomer
            });
        }
    },
    watch: {
        selectedCustomer(newVal) {
            if (newVal) {
                store.dispatch({
                    type: 'CUSTOMER_SELECTED',
                    payload: {
                        id: newVal
                    }
                });
            }
        }
    }
};
</script>
