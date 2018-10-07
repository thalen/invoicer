import * as mongoose from 'mongoose';
import * as mongooseStringQuery from 'mongoose-string-query';
import * as timestamps from 'mongoose-timestamp';
import { InvoiceInfoSchema, InvoiceInfo } from './InvoiceInfo';

const CustomerSchema = new mongoose.Schema(
    {
        user_id: {
            type: String,
            required: true
        },
        publicId: {
            type: Number,
            required: true
        },
        name: {
            type: String,
            required: true,
            trim: true
        },
        address1: {
            type: String,
            required: true,
            trim: true
        },
        address2: {
            type: String,
            required: false,
            trim: true
        },
        zipCode: {
            type: String,
            required: true
        },
        city: {
            type: String,
            required: true
        },
        country: {
            type: String,
            trim: true
        },
        orgNr: {
            type: String,
            required: true,
            trim: true
        },
        vatId: {
            type: String,
            required: true,
            trim: true
        },
        contact: {
            type: String,
            required: true,
            trim: true
        },
        paymentTerms: {
            type: Number,
            required: true

        },
        vatRate: {
            type: Number,
            min: 8
        },
        invoiceSpecs: [InvoiceInfoSchema]
    },
    { minimize: false }
);

interface ICustomer extends mongoose.Document {
    user_id: String,
    publicId: Number,
    name: String,
    address1: String,
    address2?: String,
    zipCode: String,
    city: String,
    country?: String,
    orgNr: String,
    vatId: String,
    contact: String,
    paymentTerms: Number,
    vatRate?: Number,
    invoiceSpecs: [InvoiceInfo]
}

export { ICustomer }

CustomerSchema.plugin(timestamps);
CustomerSchema.plugin(mongooseStringQuery);

const Customer = mongoose.model<ICustomer>('Customer', CustomerSchema);

export default Customer;