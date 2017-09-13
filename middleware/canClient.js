module.exports = (req, res, next) => {
    if(!req.user.permissions.client) {
        req.flash('message', 'Insufficient Permissions.');
        res.redirect('/');
        return;
    }

    return next();
};
