<template>
    <div class="invoice layout-main">
        <h3>Registrera faktura</h3>
        <fieldset class="invoice__form">
            <p>Fyll i fakturauppgifterna nedan för att skapa din faktura</p>

            <form>

                <p>
                    <label for="hours">Antal timmar</label>
                    <input v-model="form.hours" type="text" id="hours">
                </p>

                <p>
                    <label for="price">Timpris</label>
                    <input v-model="form.price" type="text" id="price">
                </p>

                <p>
                    <label for="dueDate">Förfallodatum</label>
                    <input v-model="form.dueDate" type="date" id="dueDate">
                </p>

                <p>
                    <input v-on:click="doPreview" type="submit" value="Förhandsgranska"/>
                </p>
            </form>
        </fieldset>
        <div v-if="showPdf" class="invoice__notification">
            Fakturan är laddad
            <a style="display:block" v-bind:href="pdfLink">Förhandsgranska</a>
        </div>
    </div>
</template>

<script>
    import './invoice.scss';
    import {getStore} from '../../configureStore';
    let store = getStore();
    export default {
        name: 'invoice',
        data () {
            return {
                form: {},
                showPdf: this.$select('invoice.showPdf as showPdf'),
                pdfLink: this.$select('invoice.pdfLink as pdfLink')
            }
        },
        methods: {
            doPreview(event) {
                event.preventDefault();
                store.dispatch({
                    type: 'PREVIEW_INIT',
                    model: {
                        hours: this.form.hours,
                        price: this.form.price,
                        dueDate: this.form.dueDate
                    }
                });
                this.form = {};
            }
        }
    }
</script>