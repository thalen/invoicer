<template>

    <fieldset class="customer__form" style="margin-top:30px">
        <form>
            <p>
                <label for="publicId">
                    <span>Löpnummer</span>
                    <v-icon class="customer__required" color="#ff968e">brightness_1</v-icon>
                </label>
                <input v-model="form.publicId" type="number" id="publicId">
            </p>
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

                <input v-model="form.address1" type="text" id="address1" placeholder="Gatuadress 1">
                <input v-model="form.address2" type="text" id="address2" placeholder="Gatuadress 2">
                <input v-model="form.zipCode" type="text" id="zip" placeholder="Postadress">
                <input v-model="form.city" type="text" id="city" placeholder="Stad">
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
                <label for="paymentTerms">
                    <span>Betalningsvillkor</span>
                    <v-icon class="customer__required" color="#ff968e">brightness_1</v-icon>
                </label>
                <input v-model="form.paymentTerms" type="number" id="paymentTerms">
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
            <v-btn style="margin-top:10px" type="submit" v-on:click="createCustomer" color="info">Lägg till</v-btn>
            <span v-if="createStatus === 'FAILED'" class="customer__error">Kunden kunde ej skapas</span>
            <span v-if="createStatus === 'CREATED'" class="customer__success">Kunden skapad</span>
        </form>
    </fieldset>
</template>
<script>
import './customerForm.scss';
import createCustomer from '../../actions/createCustomer';

export default {
  name: 'customerForm',
  data() {
    return {
      form: {
        vatEnabled: 'false'
      },
      createStatus: this.$select('customer.status as createStatus')
    };
  },
  methods: {
    createCustomer(event) {
      event.preventDefault();
      createCustomer(this.form);
    }
  },
  watch: {
    createStatus(newVal) {
      if (newVal === 'CREATED') {
        this.form = {
          vatEnabled: false
        };
      }
    }
  }
};
</script>
