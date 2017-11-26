import {RestService} from "./RestService";
import {Request, Response} from "restify";

const DeletePdfService : RestService = {
    execute: (req: Request, res: Response) => {
        console.log("delete service");
        res.send(200);
    }
};

export default DeletePdfService;
