module.exports = function (app, passport) {
    let isLoggedIn = require('../middleware/isLoggedIn');
    let isHost = require('../middleware/isHost');

    app.get('/', function (req, res) {
        res.render('index', {
            message: req.flash('message'),
            error: req.flash('error')
        });
    });

    app.get('/auth/google', passport.authenticate('google', {scope: ['profile', 'email']}),
        function (req, res) {
            res.redirect('/');
        }
    );

    app.get('/auth/google/return',
        passport.authenticate('google', {
            successRedirect: '/login_redirect',
            failureRedirect: '/',
            failureFlash: true
        })
    );

    app.get('/logout', function (req, res) {
        req.logout();
        req.flash('message', 'Logged out successfully.');
        res.redirect('/');
    });

    app.get('/login_redirect', isLoggedIn, function (req, res) {
        if (req.user.host) {
            res.redirect('/host')
        } else {
            res.redirect('/contestant');
        }
    });

    app.get('/contestant', isLoggedIn, function (req, res) {
        res.render('contestant', {username: req.user.name});
    });

    app.get('/host', isLoggedIn, isHost, function (req, res) {
        res.render('host', {username: req.user.name});
    });

    app.get('/not_auth', function (req, res) {
        res.render('unauthorized_socket');
    });
};
