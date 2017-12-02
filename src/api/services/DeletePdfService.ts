import {RestService} from "./RestService";
import {Request, Response} from "restify";
import * as fs from "fs";

const DeletePdfService : RestService = {
    execute: (req: Request, res: Response) => {
        let filepath = `./src/assets/invoices/${req.params.link}`;
        fs.unlink(filepath, (err) => {
            if (err) {
                res.status(500).send(err);
            } else {
                res.send(200);
            }
        });
    }
};

export default DeletePdfService;
