let SocketRoute = require('./socket-route');

module.exports = function(ws, req) {
    class ContestantSocket extends SocketRoute {
        checkIn(done) {
            this.gameLoop.contestantCheckIn(this.user, done);
        }

        eventWhiteList() {
            return [
                'move-pick',
                'lock-pick',
                'buzzed'
            ];
        }

        handleEvent(data) {
            this.gameLoop.onContestant(data.event, this.user, data.data);
        }
    }

    return new ContestantSocket(ws, req);
};