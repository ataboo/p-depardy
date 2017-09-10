module.exports = (req, res, next) => {
    if(!req.user.permissions.host) {
        req.flash('message', 'Insufficient Permissions.');
        res.redirect('/');
        return;
    }

    req.gameLoop.hostCheckIn(req.user, (success, err) => {
        if (success) {
            return next();
        }

        req.flash('message', err);
        res.redirect('/');
    });
};
