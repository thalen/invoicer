<template>
    <fieldset class="customer__form" style="margin-top:30px">

        <form>
            <p>
                <label for="name">
                    <span>Företagsnamn</span>
                    <v-icon class="customer__required" color="#ff968e">brightness_1</v-icon>
                </label>
                <input v-model="form.customerName" type="text" id="name">
            </p>

            <p>
                <label>
                    <span>Adress</span>
                    <v-icon class="customer__required" color="#ff968e">brightness_1</v-icon>
                </label>

                <input v-model="form.customerAdress" type="text" id="address" placeholder="Gatuadress">
                <input v-model="form.customerZip" type="text" id="zip" placeholder="Postadress">
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
                <input v-model="form.vat" type="text" id="vat_id">
            </p>
            <p>
                <label for="contact">
                    <span>Kontaktperson</span>
                    <v-icon class="customer__required" color="#ff968e">brightness_1</v-icon>
                </label>
                <input v-model="form.contactPerson" type="text" id="contact">
            </p>

            <v-btn style="margin-top:10px" type="submit" v-on:click="addCustomer" color="info">Lägg till</v-btn>
        </form>
    </fieldset>
</template>
<script>
    import "./customerForm.scss";
    export default {
        name: "customerForm",
        data() {
            return {
                form: {

                }
            };
        },
        methods: {
            addCustomer(event) {
                event.preventDefault();
            }
        }
    };
</script>