module.exports = function (passport, redisClient) {
    let GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
    let User = require('../models/user')(redisClient);

    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function (id, done) {
        User.findById(id, function (err, user) {
            done(err, user);
        });
    });

    passport.use(new GoogleStrategy({
            clientID: process.env.GOOGLE_CLIENT,
            clientSecret: process.env.GOOGLE_SECRET,
            callbackURL: process.env.GOOGLE_CALLBACK,
        },

        function (token, refreshToken, profile, done) {
            process.nextTick(function () {
                User.findById(profile.id, function (err, user) {
                    if (err) {
                        return done(err);
                    }

                    if (user) {
                        done(null, user);
                    } else {
                        User.newWithPermissions(profile, (user) => {
                            if (user.permissions.allowed) {
                                user.save(done);
                            } else {
                                done(null, false, {message: 'User not Whitelisted.'});
                            }
                        });
                    }
                });
            });
        }
    ));
};
