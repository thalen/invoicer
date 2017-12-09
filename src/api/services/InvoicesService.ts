import {RestService} from "./RestService";
import {Request, Response} from "restify";
import * as AWS from 'aws-sdk';
import * as fs from "fs";
import {AwsService, getAwsService} from "./aws/AwsService";
import {invoiceRenderer} from "./invoice/InvoiceRenderer";

AWS.config.loadFromPath('./aws_config.json');

const BUCKET = 'thalen.invoices.bucket';

const getInvoices : RestService = {
    execute: (req: Request, res: Response) => {
        let s3 = new AWS.S3();
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
    execute: (req: Request, res: Response) => {
        let filepath = `./src/assets/invoices/${req.params.link}`;
        let ocr = req.body.ocr;
        fs.readFile(filepath, (err, data) => {
            let s3 = new AWS.S3();
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
                    console.log('ERROR MSG: ', err);
                    res.status(500).send(err);
                } else {
                    console.log('Successfully uploaded data');
                    res.send(200);
                }
            });
        });
    }
};

const previewInvoice : RestService = {
    execute: (req: Request, res: Response) => {
        let service: AwsService = getAwsService(new AWS.S3(), BUCKET);
        service.getNextInvoiceNumber().then((nextValue) => {
            invoiceRenderer.createPdf({
                hours: req.body.hours,
                price: req.body.price,
                dueDate: req.body.dueDate,
                invoiceMonth: req.body.invoiceMonth
            }, nextValue)
                .then(result => res.json(result))
                .catch(error => res.json(error))
        });
    }
};

export {
    getInvoices,
    uploadInvoice,
    previewInvoice
}
