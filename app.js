const path = require('path');
const dotenv = require('dotenv').config();
const express = require('express');
const routeList = require("express-routes-catalogue");
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);

const User = require('./src/models/user');

const feedRoutes = require('./src/routes/web');
const authRoutes = require('./src/routes/auth');
const app = express();
// app.use(bodyParser.urlencoded()); // x-www-form-urlencoded <form>
app.use(bodyParser.json()); // application/json
app.use('/images', express.static(path.join(__dirname, 'images')));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
        'Access-Control-Allow-Methods',
        'OPTIONS, GET, POST, PUT, PATCH, DELETE'
    );
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

const store = new MongoDBStore({
    uri: 'mongodb://' + process.env.MONGODB_HOST + ':' + process.env.MONGODB_PORT,
    collection: 'sessions'
});

app.use(
    session({
        secret: process.env.TOKEN,
        resave: false,
        saveUninitialized: false,
        store: store
    })
);

app.use((req, res, next) => {
    req.session.isLoggedIn = false;
    if (!req.session.user) {
        return next();
    }
    User.findById(req.session.user._id)
        .then(user => {
            req.user = user;
            next();
        })
        .catch(err => console.log(err));
});

app.use(feedRoutes.init());
app.use(authRoutes.init());

if (process.env.NODE_ENV === "development") {
    routeList.default.web(
        app,
        "/route-list"
    );
}

app.use((error, req, res, next) => {
    console.log(error);
    const status = error.statusCode || 500;
    const message = error.message;
    res.status(status).json({message: message});
});

mongoose
    .connect(
        'mongodb://' + process.env.MONGODB_HOST + ':' + process.env.MONGODB_PORT,
        {useNewUrlParser: true}
    )
    .then(result => {
        app.listen(8080);
    })
    .catch(err => console.log(err));
