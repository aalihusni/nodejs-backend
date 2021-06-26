const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const orderSchema = new Schema(
    {
        orderId: {
            type: String,
            required: true
        },
        item: {
            type: Array,
            required: true
        },
        totalPrice: {
            type: Number,
            required: true
        },
        paymentId: {
            type: Object,
            required: String
        }
    },
    {timestamps: true}
);

module.exports = mongoose.model('order', orderSchema);