import * as mongoose from 'mongoose';
import * as mongooseStringQuery from 'mongoose-string-query';
import * as timestamps from 'mongoose-timestamp';
import { InvoiceInfoSchema } from './InvoiceInfo';

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

CustomerSchema.plugin(timestamps);
CustomerSchema.plugin(mongooseStringQuery);

const Customer = mongoose.model('Customer', CustomerSchema);

export default Customer;