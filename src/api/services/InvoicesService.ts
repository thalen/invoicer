import {RestService} from "./RestService";
import {Request, Response} from "restify";
import * as fs from "fs";
import {invoiceRenderer} from "./invoice/InvoiceRenderer";
import Customer from '../db/schemas/Customer';
import Invoice from '../db/schemas/Invoice';

const getInvoices : RestService = {
    execute: async (req: Request, res: Response) => {
        res.json([]);
    }
};

const uploadInvoice : RestService = {
    execute: async (req: Request, res: Response) => {
        const filepath = `./dist/assets/invoices/${req.params.link}`;
        //const ocr = req.body.ocr;

        //const invoiceMeta = await Invoice.findOne({ customerId: req.params.customerId }).exec();
        let awaitUpload = new Promise((resolve, reject) => {
                Invoice.update(
                    {customerId: req.params.customerId},
                    {$inc: {invoices: 1}},
                    {},
                    (err) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve();
                        }
                    });
            }
        );
        const removeFile = () => {
            fs.unlink(filepath, (err) => {
                if (err) {
                    console.log(`Failed to remove file, reason: ${err}`);
                }
            });
        };
        awaitUpload.then(() => {
            removeFile();
            res.send(200);
        }).catch((err) => {
            removeFile();
            console.log(`Error MSG: ${err}`);
            res.send(500, err);
        });
    }
};

const previewInvoice : RestService = {
    execute: async (req: Request, res: Response) => {
        const customer = await Customer.findById(req.params.customerId).exec();
        const invoiceMeta = await Invoice.findOne({customerId: req.params.customerId}).exec();
        invoiceRenderer.createPdf({
            hours: req.body.hours,
            dueDate: req.body.dueDate,
            invoiceMonth: req.body.invoiceMonth
        }, customer, invoiceMeta.invoices.valueOf() + 1)
            .then(result => res.json(result))
            .catch(error => res.json(error));
    }
};

export {
    getInvoices,
    uploadInvoice,
    previewInvoice
}
