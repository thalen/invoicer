import InvoiceRequest from "../../dto/InvoiceRequest";
import InvoiceResponse from "../../dto/InvoiceResponse";
import * as handlebars from 'express-handlebars';
import * as moment from 'moment';
import * as pdf from 'html-pdf';
import * as numeral from 'numeral';

const hbs = handlebars.create();

export interface InvoiceRenderer {
    createPdf(inputParams: InvoiceRequest, ocr: number) : Promise<InvoiceResponse>;
}

const loadTemplate = async function() {
    return hbs.getTemplate('./src/api/templates/pdf.hb.html');
};

const toPdf = (html, options) => {
    let timestamp = moment().valueOf();
    let filepath = `./src/assets/invoices/invoice_${timestamp}.pdf`;
    return new Promise((resolve) => {
        pdf.create(html, options).toFile(filepath, function(err) {
            console.log("pdf created");
            if (err) {
                console.log(err);
            }
            resolve(`/assets/invoices/invoice_${timestamp}.pdf`);
        });
    });
};


const invoiceRenderer = {
    createPdf : async (inputParams: InvoiceRequest, ocr: number) => {

        try {
            let hours = numeral(inputParams.hours);
            let price = numeral(inputParams.price);
            let amount = (hours.value() * price.value()).toString() + ',00';

            let context = {
                ocr: ocr,
                hours: hours.value(),
                price: price.value(),
                amount: amount,
                invoiceDate: moment().format('YYYY-MM-DD'),
                dueDate: inputParams.dueDate,
                invoiceMonth: inputParams.invoiceMonth
            };

            const template = await loadTemplate();
            let html = template(context);
            let options = {
                "format": "A4"
            };

            const link = await toPdf(html, options);
            return {
                success: true,
                filepath: link,
                ocr: ocr
            };

        } catch (e) {
            return Promise.reject({
                success: false
            });
        }
    }
};

export {
    invoiceRenderer
}