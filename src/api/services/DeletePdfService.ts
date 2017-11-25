import {RestService} from "./RestService";
import {Request, Response} from "restify";

export class DeletePdfService extends RestService {
    action(req: Request, res: Response) {

    }

    static instance(): RestService {
        return new DeletePdfService();
    }
}