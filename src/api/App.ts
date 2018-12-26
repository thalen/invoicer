import * as restify from 'restify';
import * as restifyPlugins from 'restify-plugins';
import * as logger from 'morgan';
import {Server} from 'restify';
import DeletePdfService from "./services/DeletePdfService";
import {callbackWith} from "./services/RestService";
import {getInvoices, previewInvoice, uploadInvoice} from "./services/InvoicesService";
import { createCustomer, getCustomers } from './services/customer/CustomerService';
import authenticateService from './services/authenticate/AuthenticateService';
import * as jwt from 'jsonwebtoken';
import connect from './db/connect';

export default function() {
    const port = process.env.PORT || 5000;
    const api = '/api';

    let server:Server = restify.createServer();

    //middleware
    server.use(logger('dev'));
    server.use(restifyPlugins.jsonBodyParser({ mapParams: true }));
    server.use(restifyPlugins.acceptParser(server.acceptable));
    server.use(restifyPlugins.queryParser({ mapParams: true }));
    server.use(restifyPlugins.urlEncodedBodyParser({
        mapParams: true
    }));
    server.use(restifyPlugins.fullResponse());

    server.post('/authenticate', callbackWith(authenticateService));

    server.get('/', restifyPlugins.serveStatic({
        directory: `${__dirname}../../../dist`,
        file: 'index.html'
    }));


    server.get('/css/(.*)?.*', restifyPlugins.serveStatic({
        directory: `${__dirname}../../../dist`
    }));

    server.get('/js/(.*)?.*', restifyPlugins.serveStatic({
        directory: `${__dirname}../../../dist`
    }));

    server.get('/assets/(.*)?.*', restifyPlugins.serveStatic({
        directory: `${__dirname}../../../dist`
    }));

    function verifyAuthentication(req, res, next) {
        // check header or url parameters or post parameters for token
        let token = (req.body ? req.body.token : undefined) || req.query.token || req.headers['authorization'];
        if (req.headers['authorization']) {
            let headerArr = token.split(' ');
            token = headerArr.length > 0 ? headerArr[1].trim() : token;
        }

        // decode token
        if (token) {
            // verifies secret and checks exp
            jwt.verify(token, process.env.secret, function (err, decoded) {
                if (err) {
                    res.send(403, {
                        success: false,
                        message: '´Failed to authenticate token.'
                    });
                    return next(false);
                } else {
                    // if everything is good, save to request for use in other routes
                    req.decoded = decoded;
                    next();
                }
            });
        } else {
            // if there is no token
            // return an error
            res.send(403, {
                success: false,
                message: 'No token provided.'
            });
            return next(false);
        }
    }

    server.del(`${api}/pdf/:link`, verifyAuthentication, callbackWith(DeletePdfService));

    server.get(`${api}/invoices`,  verifyAuthentication, callbackWith(getInvoices));

    server.post(`${api}/pdf/create/:link`, verifyAuthentication, callbackWith(uploadInvoice));

    server.post(`${api}/customer`, verifyAuthentication, callbackWith(createCustomer));

    server.post(`${api}/customer/:customerId/invoice/preview`, verifyAuthentication, callbackWith(previewInvoice));

    server.get(`${api}/customers`, verifyAuthentication, callbackWith(getCustomers));

    connect(server, port);
};
