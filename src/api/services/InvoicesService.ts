import {RestService} from "./RestService";
import {Request, Response} from "restify";
import * as AWS from 'aws-sdk';
import * as fs from "fs";
import {AwsService, getAwsService} from "./aws/AwsService";

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
            let s3bucket = new AWS.S3({params: {Bucket: BUCKET}});
            let params = {
                Key: `/assets/invoices/${req.params.link}`,
                Body: data,
                Metadata: {
                    'Content-Type': 'application/pdf',
                    'OCR': ocr
                }
            };
            s3bucket.upload(params, (err, data) => {
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
            console.log('next invoice number: ' + nextValue);
            res.send(200);
        });
    /*
        var myBucket = 'thalen.invoices.bucket';
        var s3 = new AWS.S3();
        var params = {
            Bucket: myBucket
        };
        s3.listObjects(params, function (err, data) {
            if(err)throw err;
            var allPromises = data.Contents.map(function(content) {
                var dataToDownload = {Bucket: myBucket, Key: content.Key};
                var promise = new Promise(function (resolve, reject) {
                    s3.getObject(dataToDownload, function(err, data) {
                        if (!err) {
                            resolve(data.Metadata.ocr);
                        } else {
                            reject(err);
                        }
                    });
                });
                return promise;
            });
            Promise.all(allPromises).then(function(result) {
                var maxValue = result.reduce(function(maxValue, currentValue) {
                    if (currentValue === undefined) {
                        return maxValue;
                    } else {
                        var intVal = parseInt(currentValue);
                        return intVal > maxValue ? intVal : maxValue;
                    }
                }, 0);

                var hours = numeral(req.body.hours);
                var price = numeral(req.body.price);
                var amount = hours.value() * price.value();
                amount = amount.toString() + ',00';

                var hbs = require('express-handlebars').create();

                console.log(req.body.dueDate);

                hbs.getTemplate('./src/api/templates/pdf.hb.html').then(function (template) {
                    var context = {
                        ocr: maxValue + 1,
                        hours: hours.value(),
                        price: price.value(),
                        amount: amount,
                        invoiceDate: moment().format('YYYY-MM-DD'),
                        dueDate: req.body.dueDate,
                        invoiceMonth: req.body.invoiceMonth
                    };

                    var html = template(context);

                    var options = {
                        "format": "A4"
                    };

                    var timestamp = moment().valueOf();
                    var filepath = './src/assets/invoices/invoice_' + timestamp + '.pdf';
                    var link = '/assets/invoices/invoice_' + timestamp + '.pdf';
                    pdf.create(html, options).toFile(filepath, function(err) {
                        console.log("pdf created");
                        if (err) {
                            console.log(err);
                        }
                        res.json({
                            success: true,
                            filepath: link,
                            ocr: maxValue + 1
                        });
                    });
                }).catch(function(error) {
                    res.json({
                        success: false
                    })
                });
            });
        });*/
    }
};

export {
    getInvoices,
    uploadInvoice,
    previewInvoice
}
