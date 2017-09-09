module.exports = function (redisClient) {
    const USERS_NAMESPACE = 'p_depardy_users';

    function User(attributes) {
        this.fromProfile(attributes);
    }

    User.whiteList = require('../config/whitelist')();

    User.findById = function (id, done) {
        redisClient.hget(USERS_NAMESPACE, id, function (err, res) {
            let attributes = JSON.parse(res);

            if (attributes) {
                let user = new User(attributes);

                user.isAllowed((success) => {
                    if (!success) {
                        user.delete(() => {
                            done(false, null, {message: 'User Not Whitelisted Anymore.'});
                        })
                    } else {
                        user.isHost((isHost) => {
                            user.host = isHost;
                            done(null, user);
                        });
                    }
                });
            } else {
                done(false, null);
            }
        });
    };

    User.prototype.save = function (done) {
        let user = this;
        this.isHost(function (success) {
            user.host = success;

            redisClient.hset(USERS_NAMESPACE, user.id, user.toString(), function (err, res) {
                done(null, user);
            });
        });
    };

    User.prototype.delete = function (done) {
        redisClient.hdel(USERS_NAMESPACE, this.id, function (err, res) {
            done();
        })
    };

    User.prototype.isAllowed = function (done) {
        User.whiteList.isAllowed(this.email, done);
    };

    User.prototype.isHost = function (done) {

        User.whiteList.isHost(this.email, done);
    };

    User.prototype.isClient = function (done) {
        User.whiteList.isClient(this.email, done);
    };

    User.prototype.fromProfile = function (profile) {
        this.id = profile.id;
        this.name = profile.displayName;
        if (profile.emails) {
            this.email = profile.emails[0].value;
        } else {
            this.email = profile.email;
        }
        this.token = profile.token;
    };

    User.prototype.fromString = function (rawJson) {
        if (!rawJson) {
            return false;
        }

        try {
            var attributes = JSON.parse(rawJson);
        } catch (e) {
            return false;
        }

        this.id = attributes.id;
        this.name = attributes.name;
        this.email = attributes.email;
        this.token = attributes.token;

        return self;
    };

    User.prototype.toString = function () {
        return JSON.stringify({id: this.id, displayName: this.name, token: this.token, email: this.email});
    };

    return User;
};
