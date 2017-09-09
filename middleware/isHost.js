module.exports = (req, res, next) => {
    if (req.user.host) {
        return next();
    }
    req.flash('message', 'Hosts only!');
    res.redirect('/');
};
