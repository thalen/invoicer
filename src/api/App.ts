import * as restify from 'restify';
import * as plugins from 'restify/lib/plugins';
import * as logger from 'morgan';
import {Server} from 'restify';
import DeletePdfService from "./services/DeletePdfService";
import {callbackWith} from "./services/RestService";
import {getInvoices, previewInvoice, uploadInvoice} from "./services/InvoicesService";
import authenticateService from './services/authenticate/AuthenticateService';

export default function() {
    const port = process.env.PORT || 5000;
    const api = '/api';

    let server:Server = restify.createServer();

    server.use(logger('dev'));
    server.use(plugins.queryParser({
        mapParams: true
    }));
    server.use(plugins.urlEncodedBodyParser({
        mapParams: true
    }));
    server.use((req, res, next) => {
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
        res.setHeader("Access-Control-Allow-Headers", "Authorization, X-Requested-With");
        return next();
    });

    server.post('/authenticate', callbackWith(authenticateService));

    server.get('/', plugins.serveStatic({
        directory: `${__dirname}../../../bin`,
        file: 'index.html'
    }));

    server.get(/\/assets\/(.*)?.*/, plugins.serveStatic({
        directory: `${__dirname}../../`
    }));

    server.use((req, res, next) => {
        next();
    });

    server.del(`${api}/pdf/:link`, callbackWith(DeletePdfService));

    server.get(`${api}/invoices`, callbackWith(getInvoices));

    server.post(`${api}/pdf/create/:link`, callbackWith(uploadInvoice));

    server.post(`${api}/pdf/preview`, callbackWith(previewInvoice));

    server.listen(port, () => {
        console.log('%s listening at %s', server.name, server.url);
    });
};
