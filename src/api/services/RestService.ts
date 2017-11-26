import {Next, Request, RequestHandler, Response} from "restify";

export interface RestService {
    execute(req: Request, res: Response): void;
}

export function respondWith(service: RestService) : RequestHandler {
    return (req: Request, res: Response, next: Next) => {
        service.execute(req, res);
        next();
    };
}