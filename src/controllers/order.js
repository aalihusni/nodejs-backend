const {validationResult} = require('express-validator/check');
const http = require('http');
const Order = require('../models/order');

exports.addOrder = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Validation failed, entered data is incorrect.');
        error.statusCode = 422;
        throw error;
    }
    const item = req.body.item;
    const totalPrice = req.body.totalPrice;
    const order = new Order({
        item: item,
        totalPrice: totalPrice,
    });
    order
        .save()
        .then(result => {
            res.status(201).json({
                message: 'Order created successfully!',
                post: result
            });
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
};

exports.getOrder = (req, res, next) => {
    Order.find().then((order) => {
        if (!order) {
            const error = new Error('Could not find order.');
            error.statusCode = 404;
            throw error;
        }
        res.status(200).json({message: 'Order fetched.', order: order});
    }).catch(err => {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    });
};

exports.proceedPayment = async (req, res, next) => {
    const orderId = req.body.orderId;
    await Order.findById(orderId)
        .then(order => {
            if (!order) {
                const error = new Error('Could not find post.');
                error.statusCode = 404;
                throw error;
            }
            const data = req.body;
            data['order'] = order;

            const request = http.request({
                host: 'localhost',
                port: 8080,
                path: '/payment/try',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                }
            }, function (response) {
                let data = '';
                // response.setEncoding('utf8');
                response.on('data', (chunk) => {
                    data += chunk;
                });
                response.on('end', () => {
                    data = JSON.parse(data);
                    if (data.success) {
                        res.status(200).json({
                            success: true,
                            message: "Order has completed",
                            data: []
                        }).end()
                        Order.findByIdAndUpdate(orderId, {"status": "delivered"}).then(order => {
                        });
                    } else {
                        res.status(200).json({
                            success: false,
                            message: "Something is wrong while doing payment",
                            data: []
                        }).end()
                        Order.findByIdAndUpdate(orderId, {"status": "pending payment"}).then(order => {
                        });
                    }
                });
            });
            request.write(JSON.stringify(data));
            request.end();
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
};
