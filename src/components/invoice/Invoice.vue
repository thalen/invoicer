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
                    <input v-on:click="doPreview" type="submit" value="Förhandsgranska"/>
                </p>
            </form>
        </fieldset>
        <div v-if="showPdf" class="invoice__notification">
            Fakturan är laddad
            <a target="_blank" style="display:block" v-bind:href="pdfLink">Förhandsgranska</a>
            <v-btn style="margin-top:10px" v-on:click="doSave" color="info">Spara</v-btn>
        </div>
    </div>
</template>

<script>
import "./invoice.scss";
import { getStore } from "../../configureStore";
let store = getStore();
export default {
  name: "invoice",
  data() {
    return {
      form: {
        invoiceMonth: ""
      },
      showPdf: this.$select("invoice.showPdf as showPdf"),
      pdfLink: this.$select("invoice.pdfLink as pdfLink"),
      ocr: this.$select("invoice.ocr as ocr")
    };
  },
  methods: {
    doPreview(event) {
      event.preventDefault();
      if (this.pdfLink !== void 0 && this.pdfLink !== null) {
        let arr = this.pdfLink.split("/");
        store.dispatch({
          type: "REMOVE_LINK",
          asset: arr[arr.length - 1]
        });
      }
      store.dispatch({
        type: "PREVIEW_INIT",
        model: {
          hours: this.form.hours,
          price: this.form.price,
          dueDate: this.form.dueDate,
          invoiceMonth: this.form.invoiceMonth
        }
      });
      this.form = {
        invoiceMonth: ""
      };
    },
    doSave(event) {
      event.preventDefault();
      let arr = this.pdfLink.split("/");
      store.dispatch({
        type: "SAVE_INVOICE",
        pdf: arr[arr.length - 1],
        ocr: this.ocr
      });
    }
  }
};
</script>
