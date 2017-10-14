var express    = require('express');        // call express
var app        = express();                 // define our app using express
var bodyParser = require('body-parser');
var morgan = require('morgan');
var pdf = require('html-pdf');
var moment = require('moment');
var numeral = require('numeral');
var AWS = require('aws-sdk');
var fs = require('fs');
var Promise = require('promise');

AWS.config.loadFromPath('./aws_config.json');

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// use morgan to log requests to the console
app.use(morgan('dev'));

app.use(function(req, res, next) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Authorization, X-Requested-With");
    return next();
});

var port = process.env.PORT || 5000;        // set our port

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();              // get an instance of the express Router

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
    res.json({ message: 'hooray! welcome to our api!' });
});

router.delete('/pdf/:link', function(req, res) {
    var filepath = './src/assets/invoices/' + req.params.link;
    fs.unlink(filepath, function(err) {
        if (err) {
            res.status(500).send(err);
        } else {
            res.send(200);
        }
    });
});

router.post('/pdf/create/:link', function(req, res) {
    var filepath = './src/assets/invoices/' + req.params.link;
    fs.readFile(filepath, function (err, data) {
        var myBucket = 'thalen.invoices.bucket';
        var s3bucket = new AWS.S3({params: {Bucket: myBucket}});
        var params = {
            Key: '/assets/invoices/' + req.params.link,
            Body: data,
            Metadata: {
                'Content-Type': 'application/pdf',
                'OCR': '1'
            }
        };
        s3bucket.upload(params, function (err, data) {
            if (err) {
                console.log('ERROR MSG: ', err);
                res.status(500).send(err);
            } else {
                console.log('Successfully uploaded data');
                res.send(200);
            }
        });
    });
});

router.post('/pdf/preview', function(req, res) {
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
                        filepath: link
                    });
                });
            }).catch(function(error) {
                res.json({
                    success: false
                })
            });
        });
    });

});

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log("Now I'm restful on port " + port);
