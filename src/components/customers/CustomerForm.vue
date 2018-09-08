<template>
    <fieldset class="customer__form" style="margin-top:30px">

        <form style="padding: 10px 20px">
            <p>
                <label for="active">Aktiv</label>
                <input v-model="form.active" type="checkbox" id="active">
            </p>
            <p>
                <label for="name">Företagsnamn</label>
                <input v-model="form.customerName" type="text" id="name">
            </p>

            <p>
                <label for="adress">Address</label>
                <input v-model="form.customerAdress" type="text" id="adress">
            </p>

            <p>
                <label for="orgnr">Organisationsnummer</label>
                <input v-model="form.orgNr" type="text" id="orgnr">
            </p>
            <p>
                <label for="vat_id">Moms regnr</label>
                <input v-model="form.vat" type="text" id="vat_id">
            </p>
            <p>
                <label for="contact">Kontaktperson</label>
                <input v-model="form.contactPerson" type="text" id="contact">
            </p>

        </form>
    </fieldset>
</template>
<script>
    export default {
        name: "customerForm",
        data() {
            return {
                form: {

                }
            };
        },
        methods: {

        }
    };
</script>