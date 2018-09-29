import * as mongoose from 'mongoose';
import * as mongooseStringQuery from 'mongoose-string-query';
import * as timestamps from 'mongoose-timestamp';

const InvoiceSchema = new mongoose.Schema(
    {
        customerId: {
            type: String,
            required: true
        },
        invoices: {
            type: Number,
            default: 0
        }
    },
    { minimize: false }
);

interface Invoice extends mongoose.Document {
    customerId: String,
    invoices: Number
}

export { Invoice }

InvoiceSchema.plugin(timestamps);
InvoiceSchema.plugin(mongooseStringQuery);

const InvoiceModel = mongoose.model<Invoice>('Invoice', InvoiceSchema);

export default InvoiceModel;