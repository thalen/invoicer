import {RestService} from "../RestService";
import {Request, Response} from "restify";
import Customer from '../../db/schemas/Customer';

const createCustomer : RestService = {
    execute: async (req: Request, res: Response) => {
        try {
            const decoded = req['decoded'];
            const { invoiceSpecification, invoiceRate, ...rest } = req.body;
            const data = {
                ...rest,
                user_id: decoded.user,
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

const getCustomers : RestService = {
    execute: async (req: Request, res: Response) => {
        try {
            //TODO: make this TS compliant instead of using JS hack
            const apiQuery = Customer['apiQuery'].bind(Customer);
            const customers = await apiQuery(req.params).exec();
            res.json(customers);
        } catch (e) {
            console.log(e);
            throw e;
        }

    }
};

export {
    createCustomer,
    getCustomers
};
