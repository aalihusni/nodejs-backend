const {validationResult} = require('express-validator/check');
const bcrypt = require('bcryptjs');
const User = require('../models/user');


exports.signup = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;
    User.findOne({email: email})
        .then(userDoc => {
            if (userDoc) {
                //user exist tell them to login
            }
            return bcrypt
                .hash(password, 12)
                .then(hashedPassword => {
                    const user = new User({
                        email: email,
                        password: hashedPassword,
                        cart: {items: []}
                    });
                    return user.save();
                })
                .then(result => {
                    //success redirect to login
                });
        })
        .catch(err => {
            console.log(err);
        });
};

exports.login = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    User.findOne({email: email})
        .then(user => {
            if (!user) {
                //user does not exist, error
            }
            bcrypt
                .compare(password, user.password)
                .then(doMatch => {
                    if (doMatch) {
                        req.session.isLoggedIn = true;
                        req.session.user = user;
                        return req.session.save(err => {
                            console.log(err);
                            //success user can navigate
                        });
                    }
                    //if password does not match tell them to login
                })
                .catch(err => {
                    console.log(err);
                    //error happened tell user to login
                });
        })
        .catch(err => console.log(err));
};

exports.logout = (req, res, next) => {
    req.session.destroy(err => {
        console.log(err);
        //session destroyed interface should
    });
};

exports.forgotPassword = (req, res, next) => {

};
