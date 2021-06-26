const { validationResult } = require('express-validator/check');

const Order = require('../models/order');

exports.addOrder = (req, res, next) => {

};

exports.getOrder = (req, res, next) => {

};

exports.proceedPayment = (req, res, next) => {
    var request = http.request({
        host: 'localhost',
        port: 8081,
        path: '/test',
        method: 'GET',
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