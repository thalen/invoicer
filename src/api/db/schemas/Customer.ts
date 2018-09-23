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
        name: {
            type: String,
            required: true,
            trim: true
        },
        address: {
            type: String,
            required: true,
            trim: true
        },
        zipCode: {
            type: Number,
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
    name: String,
    address: String,
    zipCode: Number,
    city: String,
    country: String,
    orgNr: String,
    vatId: String,
    contact: String,
    invoiceSpecs: InvoiceInfo
};

export { ICustomer }

CustomerSchema.plugin(timestamps);
CustomerSchema.plugin(mongooseStringQuery);

const Customer = mongoose.model<ICustomer>('Customer', CustomerSchema);

export default Customer;