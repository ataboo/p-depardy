let SocketRoute = require('./socket-route');

module.exports = function(ws, req) {
    class SpectatorSocket extends SocketRoute {
        checkIn(done) {
            this.gameLoop.spectatorCheckIn(this.user, done);
        }

        eventWhiteList() {
            return [];
        }

        handleEvent(data) {
            this.gameLoop.onSpectator(data.event, this.user, data);
        }
    }

    return new SpectatorSocket(ws, req);
};