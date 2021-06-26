const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const paymentSchema = new Schema(
    {
        order: {
            type: Schema.Types.ObjectId,
            ref: 'order',
            required: true
        },
        status: {
            type: String,
            required: true
        }
    },
    {timestamps: true}
);

module.exports = mongoose.model('payment', paymentSchema);