module.exports = function(socket, gameLoop) {
    socket.request.user.socketId = socket.id;
    gameLoop.spectatorCheckIn(socket.request.user, ()=>{});

    socket.on('message', (msg) => {
        console.log('Got spectator message. ' + msg);
    });
};