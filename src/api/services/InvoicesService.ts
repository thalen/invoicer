import {RestService} from "./RestService";
import {Request, Response} from "restify";
import * as AWS from 'aws-sdk';
import * as fs from "fs";
import {invoiceRenderer} from "./invoice/InvoiceRenderer";
import Customer from '../db/schemas/Customer';
import Invoice from '../db/schemas/Invoice';

const config = new AWS.Config({
    credentials: {
        accessKeyId: process.env.aws_access_key,
        secretAccessKey: process.env.aws_secret_access_key
    },
    region: process.env.aws_default_region
});

const BUCKET = 'thalen.invoices.bucket';

const getInvoices : RestService = {
    execute: async (req: Request, res: Response) => {
        let s3 = new AWS.S3(config);
        let params = {
            Bucket: BUCKET
        };
        s3.listObjects(params, (err, data) => {
            if (err) throw err;
            res.json(data.Contents);
        });
    }
};

const uploadInvoice : RestService = {
    execute: async (req: Request, res: Response) => {
        const filepath = `./dist/assets/invoices/${req.params.link}`;
        const ocr = req.body.ocr;
        console.log(req.params.customerId);
        const invoiceMeta = await Invoice.findOne({ customerId: req.params.customerId }).exec();
        let awaitUpload = new Promise((resolve, reject) => {
            fs.readFile(filepath, (err, data) => {
                if (err) {
                    reject(err);
                    return;
                }
                let s3 = new AWS.S3(config);
                let params = {
                    Bucket: BUCKET,
                    Key: `/assets/invoices/${req.params.link}`,
                    Body: data,
                    Metadata: {
                        'Content-Type': 'application/pdf',
                        'OCR': ocr
                    }
                };

                s3.upload(params, (err, data) => {
                    if (err) {
                        reject(err);
                    } else {
                        Invoice.update(
                            { customerId: req.params.customerId},
                            { $inc: { invoices: 1 }},
                            {},
                            (err) => {
                                if (err) {
                                    reject(err);
                                } else {
                                    resolve(data);
                                }
                            });
                    }
                });

            });
        });
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
