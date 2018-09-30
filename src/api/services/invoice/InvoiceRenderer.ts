import InvoiceRequest from "../../mappers/InvoiceRequest";
import InvoiceResponse from "../../mappers/InvoiceResponse";
import * as handlebars from 'express-handlebars';
import * as moment from 'moment';
import * as pdf from 'html-pdf';
import * as numeral from 'numeral';
import { ICustomer } from "../../db/schemas/Customer";
import {contextBuilder, withCustomer, withInputParams, withOcr, withVat} from "../builders/ContextBuilder";

const hbs = handlebars.create();

export interface InvoiceRenderer {
    createPdf(inputParams: InvoiceRequest, ocr: number) : Promise<InvoiceResponse>;
}

const loadTemplate = async function() {
    return hbs.getTemplate('./src/api/templates/pdf.hb.html');
};

const toPdf = (html, options) => {
    let timestamp = moment().valueOf();
    let filepath = `./dist/assets/invoices/invoice_${timestamp}.pdf`;
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
    createPdf : async (inputParams: InvoiceRequest, customer: ICustomer, ocr: number) => {

        try {
            const ocrBuilder = withOcr(ocr);
            const paramsBuilder = withInputParams(inputParams, customer.invoiceSpecs[0].price);
            const customerBuilder = withCustomer(customer);
            const context = contextBuilder(ocrBuilder, paramsBuilder, customerBuilder);
            let vatInfo = {};
            if (context.customer.isVat) {
                vatInfo = withVat(inputParams, customer.invoiceSpecs[0].price, customer.vatRate);
            }
            const template = await loadTemplate();
            let html = template({
                ...context,
                ...vatInfo
            });
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
            console.log(e);
            return Promise.reject({
                success: false
            });
        }
    }
};

export {
    invoiceRenderer
}