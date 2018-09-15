import * as mongoose from 'mongoose';
import * as mongooseStringQuery from 'mongoose-string-query';
import * as timestamps from 'mongoose-timestamp';

const InvoiceInfoSchema = new mongoose.Schema(
    {
        specification: {
            type: String,
            required: true,
            trim: true
        },
        price: {
            type: Number,
            min: 1,
            required: true
        }
    },
    { minimize: false }
);


InvoiceInfoSchema.plugin(timestamps);
InvoiceInfoSchema.plugin(mongooseStringQuery);

export { InvoiceInfoSchema };

const InvoiceInfo = mongoose.model('InvoiceInfo', InvoiceInfoSchema);

export default InvoiceInfo;