module.exports = (req, res, next) => {
    req.gameLoop.spectatorCheckIn(req.user, (success, err) => {
        if (success) {
            return next();
        }

        req.flash('message', err);
        res.redirect('/');
    });
};
