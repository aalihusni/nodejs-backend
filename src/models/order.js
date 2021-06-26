const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const orderSchema = new Schema(
    {
        item: {
            type: String,
            required: true
        },
        status: {
            type: String,
            required: true,
            default: 'new order'
        },
        totalPrice: {
            type: Number,
            required: true
        },
    },
    {timestamps: true}
);

module.exports = mongoose.model('order', orderSchema);