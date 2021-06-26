const { validationResult } = require('express-validator/check');
const http = require('http');
const Order = require('../models/order');

exports.addOrder = (req, res, next) => {

};

exports.getOrder = (req, res, next) => {

};

exports.proceedPayment = (req, res, next) => {
    var request = http.request({
        host: 'localhost',
        port: 8080,
        path: '/payment/try',
        method: 'POST',
        headers: {
            // headers such as "Cookie" can be extracted from req object and sent to /test
        }
    }, function(response) {
        var data = '';
        response.setEncoding('utf8');
        response.on('data', (chunk) => {
            data += chunk;
        });
        response.on('end', () => {
            res.end('check result: ' + data);
        });
    });
    request.end();
};