module.exports = function () {
    let whiteList;

    function _getWhiteList(done) {
        if (!whiteList) {
            require('fs').readFile('whitelist.json', 'utf8', function (err, data) {
                if (err) {
                    throw err;
                }
                whiteList = JSON.parse(data);
                done(whiteList);
            });
        } else {
            done(whiteList);
        }
    }

    function _hasEmail(email, emailMap) {
        let hasCCID = emailMap.domains.some((element) => {
            return element === email.split('@')[1];
        });
        let hasFullEmail = emailMap.emails.some((element) => {
            return element === email;
        });

        return hasCCID || hasFullEmail;
    }

    return {
        getPermissions: function (email, done) {
            _getWhiteList((whiteList) => {
                let host = _hasEmail(email, whiteList.hosts);
                let client = _hasEmail(email, whiteList.clients);
                let allowed = host || client;

                done({
                    host: host,
                    client: client,
                    allowed: allowed
                });
            })
        }
    }
};