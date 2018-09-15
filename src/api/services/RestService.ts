import {Next, Request, RequestHandler, Response} from 'restify';
import * as errors from 'restify-errors';

export interface RestService {
    execute(req: Request, res: Response, next?: Next): Promise<any>;
}

export function callbackWith(service: RestService): RequestHandler {
    return (req: Request, res: Response, next: Next) => {

        service.execute(req, res).then(() => {
            next();
        }).catch(e => {
            return next(new errors.InternalError(e.message));
        });

    };
}
