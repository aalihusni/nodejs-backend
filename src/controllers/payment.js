const {validationResult} = require('express-validator/check');

const Payment = require('../models/payment');

let transaction = '';
exports.confirmPayment = async (req, res, next) => {
    await new Promise(resolve => setTimeout(resolve, 5000));
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Validation failed, entered data is incorrect.');
        error.statusCode = 422;
        throw error;
    }

    transaction = Math.floor(Math.random() * 10) + 1;
    //submit payment
    if (transaction > 5) {
        transaction = true;
    } else {
        transaction = false;
    }

    const amount = req.body.amount;
    const order = req.body.order;
    const payment = await new Payment({
        amount: amount,
        order : order,
        status: transaction,
    });
    payment
        .save()
        .then(result => {
            res.status(200).json({
                success: transaction,
                message: "Payment for oder has completed" ,
                data: result
            }).end();
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });

};

