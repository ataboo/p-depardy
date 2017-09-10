module.exports = (req, res, next) => {
    if (req.isAuthenticated() && req.user.permissions.allowed) {
        return next();
    }
    req.flash('loginMessage', 'Please log in.');
    res.redirect('/');
};
