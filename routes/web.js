module.exports = function (app, passport) {
    let isLoggedIn = require('../middleware/isLoggedIn');
    let canHost = require('../middleware/canHost');
    let canContestant = require('../middleware/canClient');

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
            successRedirect: '/logged_in',
            failureRedirect: '/',
            failureFlash: true
        })
    );

    app.get('/logout', function (req, res) {
        req.logout();
        req.flash('message', 'Logged out successfully.');
        res.redirect('/');
    });

    app.get('/logged_in', isLoggedIn, function(req, res) {
        res.render('logged_in', {
            user: req.user,
            game: {}
        });
    });

    app.get('/spectator', isLoggedIn, canContestant, function(req, res) {
        res.render('spectator', {user: req.user});
    });

    app.get('/contestant', isLoggedIn, canContestant, function (req, res) {
        res.render('contestant', {user: req.user});
    });

    app.get('/host', isLoggedIn, canHost, function (req, res) {
        res.render('host', {user: req.user});
    });

    app.get('/not_auth', function (req, res) {
        res.render('unauthorized_socket');
    });
};
