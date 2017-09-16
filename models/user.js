module.exports = function () {
    const redisClient = require('../middleware/global').redisClient
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

                user.loadPermissions((user) => {
                    if (!user.permissions.allowed) {
                        user.delete(() => {
                            done(false, null, {message: 'User No Longer Whitelisted.'});
                        });
                    } else {
                        done(null, user);
                    }
                });
            } else {
                done(false, null);
            }
        });
    };

    User.newWithPermissions = function(profile, done) {
        let user = new User(profile);

        user.loadPermissions(done);
    };

    User.prototype.save = function (done) {
        let user = this;
        redisClient.hset(USERS_NAMESPACE, user.id, user.toString(), function (err, res) {
            done(null, user);
        });
    };

    User.prototype.delete = function (done) {
        redisClient.hdel(USERS_NAMESPACE, this.id, function (err, res) {
            done();
        })
    };

    User.prototype.loadPermissions = function(done) {
        User.whiteList.getPermissions(this.email, (permissions) => {
            this.permissions = permissions;
            done(this);
        });
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

    User.prototype.toString = function () {
        return JSON.stringify({id: this.id, displayName: this.name, token: this.token, email: this.email});
    };

    return User;
};
