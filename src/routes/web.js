const Router = require('express-group-router');
let router = new Router();

const {body} = require('express-validator/check');

const isAuth = require('../middleware/is-auth');

const feedController = require('../controllers/feedController');
const orderController = require('../controllers/orderController');

router.group('/feed', isAuth, (router) => {
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

router.group('/order', isAuth, (router) => {
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
