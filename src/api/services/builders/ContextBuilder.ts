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
        country: customer.country,
        orgNr: customer.orgNr,
        vatId: customer.vatId,
        contact: customer.contact,
        isVat: !!customer.vatRate,
        vatRate: customer.vatRate || 0,
        invoiceSpec: customer.invoiceSpecs[0].specification.split('\n')
    }
});

const withVat = (inputParams: InvoiceRequest, rate: Number, vatRate: Number) => {
    const hours = numeral(inputParams.hours);
    const price = numeral(rate);
    const amount = hours.value() * price.value();
    const vatRatio = vatRate.valueOf() / 100;
    const vatAmount = (amount * vatRatio).toString() + ',00';
    const totalAmount = ((amount * vatRatio) + amount).toString() + ',00';
    return {
        vatAmount,
        totalAmount
    }
};

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
    contextBuilder,
    withVat
}
