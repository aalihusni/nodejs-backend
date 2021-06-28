const Router = require('express-group-router');
let router = new Router();

const {body} = require('express-validator/check');

const feedController = require('../controllers/feed');
const orderController = require('../controllers/order');
const paymentController = require('../controllers/payment');

router.group('/feed', [], (router) => {
    router.get('/posts', function (req, res, next) {
        feedController.getPosts(req, res, next)
    });
    router.post('/post', function (req, res, next) {
        feedController.createPost(req, res, next)
    });
    router.get('/post/:postId', function (req, res, next) {
        feedController.getPost(req, res, next)
    });
});

router.group('/order', [], (router) => {
    router.get('/list', function (req, res, next) {
        orderController.getOrder(req, res, next)
    });
    router.post('/add', function (req, res, next) {
        orderController.addOrder(req, res, next)
    });
    router.post('/payment', function (req, res, next) {
        orderController.proceedPayment(req, res, next)
    });
});

module.exports = router;
