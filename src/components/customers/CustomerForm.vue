<template>
    <fieldset class="customer__form" style="margin-top:30px">

        <form>
            <p>
                <label for="name">
                    <span>Företagsnamn</span>
                    <v-icon class="customer__required" color="#ff968e">brightness_1</v-icon>
                </label>
                <input v-model="form.name" type="text" id="name">
            </p>

            <p>
                <label>
                    <span>Adress</span>
                    <v-icon class="customer__required" color="#ff968e">brightness_1</v-icon>
                </label>

                <input v-model="form.address" type="text" id="address" placeholder="Gatuadress">
                <input v-model="form.zipCode" type="text" id="zip" placeholder="Postadress">
                <input v-model="form.country" type="text" id="country" placeholder="Land">
            </p>

            <p>
                <label for="orgnr">
                    <span>Organisationsnummer</span>
                    <v-icon class="customer__required" color="#ff968e">brightness_1</v-icon>
                </label>
                <input v-model="form.orgNr" type="text" id="orgnr">
            </p>
            <p>
                <label for="vat_id">
                    <span>Moms regnr</span>
                    <v-icon class="customer__required" color="#ff968e">brightness_1</v-icon>
                </label>
                <input v-model="form.vatId" type="text" id="vat_id">
            </p>
            <p>
                <label for="contact">
                    <span>Kontaktperson</span>
                    <v-icon class="customer__required" color="#ff968e">brightness_1</v-icon>
                </label>
                <input v-model="form.contact" type="text" id="contact">
            </p>
            <p>
                <label>
                    <span>Moms</span>
                </label>
                <label style="display:inline-block">
                    <input v-model="form.vatEnabled" type="radio" id="vat_yes" name="vat" value="true">
                    Ja
                </label>
                <label style="display:inline-block;margin-left:16px">
                    <input v-model="form.vatEnabled" type="radio" id="vat_no" name="vat" value="false">
                    Nej
                </label>
            </p>
            <p v-if="form.vatEnabled==='true'">
                <label for="vat_rate">
                    <span>Momssats</span>
                    <v-icon class="customer__required" color="#ff968e">brightness_1</v-icon>
                </label>
                <input v-model="form.vatRate" type="number" id="vat_rate">
            </p>
            <p>
                <label>
                    <span>Fakturering</span>
                    <v-icon class="customer__required" color="#ff968e">brightness_1</v-icon>
                </label>

                <v-textarea
                        v-model="form.invoiceSpecification"
                        label="Specifikation"
                        solo
                        name="input-7-4"
                ></v-textarea>
                <input v-model="form.invoiceRate" type="text" placeholder="Timpris">
            </p>
            <v-btn style="margin-top:10px" type="submit" v-on:click="addCustomer" color="info">Lägg till</v-btn>
            <span v-if="createStatus === 'FAILED'" class="customer__error">Inloggningen misslyckades</span>
            <span v-if="createStatus === 'CREATED'" class="customer__success">Kunden skapad</span>
        </form>
    </fieldset>
</template>
<script>
    import "./customerForm.scss";
    import { getStore } from "../../configureStore";
    const store = getStore();
    export default {
        name: "customerForm",
        data() {
            return {
                form: {
                    vatEnabled: 'false'
                },
                createStatus: this.$select("customer.status as createStatus"),
            };
        },
        methods: {
            addCustomer(event) {
                event.preventDefault();
                store.dispatch({
                    type: "CREATE_CUSTOMER",
                    form: {
                        ...this.form
                    }
                });
            }
        },
        watch: {
            createStatus(newVal) {
                if (newVal === 'CREATED') {
                    this.form = {
                        vatEnabled: false
                    }
                }
            }
        }
    };
</script>