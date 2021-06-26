const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const paymentSchema = new Schema(
    {
        paymentId: {
            type: String,
            required: true
        },
        orderId: {
            type: String,
            required: true
        },
        amount: {
            type: Number,
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