var express    = require('express');        // call express
var app        = express();                 // define our app using express
var bodyParser = require('body-parser');
var morgan = require('morgan');
var pdf = require('html-pdf');
var moment = require('moment');
var numeral = require('numeral');

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

router.post('/pdf/create', function(req, res) {
    var hours = numeral(req.body.hours);
    var price = numeral(req.body.price);
    var amount = hours.value() * price.value();
    amount = amount.toString() + ',00';

    var hbs = require('express-handlebars').create();
    
    console.log(req.body.dueDate);
    
    hbs.getTemplate('./src/api/templates/pdf.hb.html').then(function (template) {
        var context = {
            hours: hours.value(),
            price: price.value(),
            amount: amount,
            invoiceDate: moment().format('YYYY-MM-DD'),
            dueDate: req.body.dueDate
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

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log("Now I'm restful on port " + port);
