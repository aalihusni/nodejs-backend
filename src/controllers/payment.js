const { validationResult } = require('express-validator/check');

const Payment = require('../models/payment');

exports.confirmPayment = async (req, res, next) => {
    await new Promise(resolve => setTimeout(resolve, 5000));
    //submit payment 
    res.status(200).json({message: 'success'});
};

