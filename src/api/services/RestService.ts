import {Request, Response, Next, RequestHandler} from "restify";

export abstract class RestService {
    abstract action(req: Request, res: Response);

    respond: RequestHandler = (req: Request, res: Response, next: Next) => {
        this.action(req, res);
        next();
    };
}