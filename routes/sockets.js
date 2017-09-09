module.exports = function (io) {
    let util = require('util');

    io.sockets.on('connection', function (socket) {
        console.log("Client: " + socket.client.id + " connected.");

        socket.on('disconnect', () => {
            console.log('Client: ' + socket.client.id + ' disconnected.');
        });

        socket.on('message', (msg) => {
            if (socket.request.user && socket.request.user.logged_in) {
                socket.emit('message', msg + ' was recieved!');
                console.log('msg');
            } else {
                console.log('unauthorized socket attempt');
            }
        });
    });
};
