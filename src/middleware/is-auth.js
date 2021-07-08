module.exports = (req, res, next) => {
    if (!req.session.isLoggedIn) {
        console.log("Unauthorized");
        return res.redirect('/');
    }
    next();
};
