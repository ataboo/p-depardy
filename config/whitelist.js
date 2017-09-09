module.exports = function() {
    let whiteList;

    function _getWhiteList(done) {
        if (!whiteList) {
            require('fs').readFile('whitelist.json', 'utf8', function(err, data) {
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
        let hasCCID = emailMap.ccids.some((element) => {return element+'@ualberta.ca' === email;});
        let hasFullEmail = emailMap.ccids.some((element) => {return element === email;});

        return hasCCID || hasFullEmail;
    }

    return {
        isClient: function(email, done) {
            _getWhiteList((whiteList) => {
                done(_hasEmail(email, whiteList.clients));
            });
        },
        isHost: function(email, done) {
            _getWhiteList((whiteList) => {
                done(_hasEmail(email, whiteList.hosts));
            });
        },
        isAllowed: function(email, done) {
            _getWhiteList((whiteList) => {
                done(_hasEmail(email, whiteList.hosts) || _hasEmail(email, whiteList.clients));
            })
        }
    }
};