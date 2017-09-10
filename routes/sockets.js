module.exports = function(io, getGameLoop) {
    let contestant = require('./socket/contestant');
    let host = require('./socket/host');
    let spectator = require('./socket/spectator');

    io.sockets.on('connection', function (socket) {
        if (socket.request.user && socket.request.user.logged_in) {
            getGameLoop((gameLoop) => {
                _delegateSocketRoute(socket, gameLoop);
            });
        }
    });

    function _delegateSocketRoute(socket, gameLoop) {
        let userType = gameLoop.getUserType(socket.request.user.id);
        console.log('userType: '+userType);
        switch(userType) {
            case 'host':
                host(socket, gameLoop);
                break;
            case 'contestant':
                contestant(socket, gameLoop);
                break;
            default:
                spectator(socket, gameLoop);
        }
    }
};
