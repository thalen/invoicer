import * as numeral from 'numeral';
import InvoiceRequest from "../../mappers/InvoiceRequest";
import { ICustomer } from "../../db/schemas/Customer";
import * as moment from "moment";

const withOcr = ocr => context => ({
    ...context,
    ocr
});

const withInputParams = (inputParams: InvoiceRequest, rate: Number) => context => {
    const hours = numeral(inputParams.hours);
    const price = numeral(rate);
    const amount = (hours.value() * price.value()).toString() + ',00';
    return {
        ...context,
        hours: hours.value(),
        amount,
        invoiceDate: moment().format('YYYY-MM-DD'),
        dueDate: inputParams.dueDate,
        invoiceMonth: inputParams.invoiceMonth
    };
};

const withCustomer = (customer: ICustomer) => context => ({
    ...context,
    price: customer.invoiceSpecs[0].price,
    customer: {
        publicId: customer.publicId,
        name: customer.name,
        address: customer.address,
        zipCode: customer.zipCode,
        city: customer.city,
        country: customer.country
    }
});

const contextBuilder = (...builders) => {
    const reducer = (accumalator, current) => {
        const nextValue = current();
        return {
            ...accumalator,
            ...nextValue
        };
    };
    return builders.reduce(reducer, {});
};

export {
    withOcr,
    withInputParams,
    withCustomer,
    contextBuilder
}
