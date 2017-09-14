let SocketRoute = require('./socket-route');

module.exports = function(ws, req) {
    class HostSocket extends SocketRoute {
        checkIn(done) {
            this.gameLoop.hostCheckIn(this.user, done);
        }

        eventWhiteList() {
            return [
                'start-pick',
                'start-buzz',
                'right-answer',
                'wrong-answer',
            ];
        }

        handleEvent(data) {
            this.gameLoop.onHost(data.event, this.user, data);
        }
    }

    return new HostSocket(ws, req);
};
