import {RestService} from "./RestService";
import {Request, Response} from "restify";
import * as AWS from 'aws-sdk';
import * as fs from "fs";
import {AwsService, getAwsService} from "./aws/AwsService";
import {invoiceRenderer} from "./invoice/InvoiceRenderer";

const config = new AWS.Config({
    credentials: {
        accessKeyId: process.env.aws_access_key,
        secretAccessKey: process.env.aws_secret_access_key
    },
    region: process.env.aws_default_region
});

const BUCKET = 'thalen.invoices.bucket';

const getInvoices : RestService = {
    execute: (req: Request, res: Response) => {
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
    execute: (req: Request, res: Response) => {
        const filepath = `./dist/assets/invoices/${req.params.link}`;
        const ocr = req.body.ocr;
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
                        resolve(data);
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
    execute: (req: Request, res: Response) => {
        let service: AwsService = getAwsService(new AWS.S3(config), BUCKET);
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
