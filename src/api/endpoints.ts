import * as restify from 'restify';
import {Server, RequestHandler, Request, Response, Next} from 'restify';
import {DeletePdfService} from "./services/DeletePdfService";

const port = process.env.PORT || 5000;
const api = '/api';

let server:Server = restify.createServer();

server.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Authorization, X-Requested-With");
    return next();
});

server.del(`${api}/pdf/:link`, DeletePdfService.instance().respond);

server.listen(port, () => {
    console.log('%s listening at %s', server.name, server.url);
});
