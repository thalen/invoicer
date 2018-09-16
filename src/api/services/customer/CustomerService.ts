import {RestService} from "../RestService";
import {Request, Response} from "restify";
import Customer from '../../db/schemas/Customer';

const createCustomer : RestService = {
    execute: async (req: Request, res: Response) => {
        try {
            const { invoiceSpecification, invoiceRate, ...rest } = req.body;
            const data = {
                ...rest,
                invoiceSpecs: [{
                    specification: invoiceSpecification,
                    price: invoiceRate
                }]
            };

            const customer = new Customer(data);
            await customer.save();
            res.send(201);
        } catch (e) {
            console.log(e);
            throw e;
        }
    }
};

export {
    createCustomer
};

