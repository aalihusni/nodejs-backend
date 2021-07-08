const Router = require('express-group-router');
let router = new Router();

const {body} = require('express-validator/check');
const authController = require('../controllers/authController')

router.group('/auth', [], (router) => {
    router.post('/signup', function (req, res, next) {
        authController.signup(req, res, next)
    });
    router.post('/login', function (req, res, next) {
        authController.login(req, res, next)
    });
    router.post('/logout', function (req, res, next) {
        authController.logout(req, res, next)
    });
});

module.exports = router;
