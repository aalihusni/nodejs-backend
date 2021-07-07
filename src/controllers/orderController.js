const {validationResult} = require('express-validator/check');
const http = require('http');
const OrderController = require('../models/order');

exports.addOrder = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Validation failed, entered data is incorrect.');
        error.statusCode = 422;
        throw error;
    }
    const item = req.body.item;
    const totalPrice = req.body.totalPrice;
    const order = new OrderController({
        item: item,
        totalPrice: totalPrice,
    });
    order
        .save()
        .then(result => {
            res.status(201).json({
                message: 'OrderController created successfully!',
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
    OrderController.find().then((order) => {
        if (!order) {
            const error = new Error('Could not find order.');
            error.statusCode = 404;
            throw error;
        }
        res.status(200).json({message: 'OrderController fetched.', order: order});
    }).catch(err => {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    });
};

exports.proceedPayment = async (req, res, next) => {
    const orderId = req.body.orderId;
    const data = req.body;

    await OrderController.findById(orderId)
        .then(async order => {
            if (!order) {
                const error = new Error('Could not find post.');
                error.statusCode = 404;
                throw error;
            }
            //inject order into request body
            data['order'] = order;

            let result = await callPayment(orderId, data);
            let message = "Something is wrong while making payment"

            if (result) {
                message = "OrderController has completed";
            }

            res.status(200).json({
                status: result,
                message: message,
                data: []
            }).end();

        }).catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
}

function callPayment(orderId, data) {
    return new Promise((resolve, reject) => {
        //call to another instance on port 8082 to simulate microservices
        const request = http.request({
            host: 'nodejs-2',
            port: "8082",
            path: '/payment/try',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            }
        }, function (response) {
            console.log("here");
            let data = '';
            response.on('data', (chunk) => {
                data += chunk;
            });
            response.on('end', () => {
                data = JSON.parse(data);
                if (data.success) {
                    updateOrder(orderId, {"status": "delivered"});
                    resolve(true);
                } else {
                    updateOrder(orderId, {"status": "pending payment"});
                    resolve(false);
                }
            });
        });
        request.write(JSON.stringify(data));
        request.end();
    });
}

function updateOrder(orderId, message) {
    OrderController.findByIdAndUpdate(orderId, message).then(order => {
    }).catch(err => {
        console.log(err);
    });
}
