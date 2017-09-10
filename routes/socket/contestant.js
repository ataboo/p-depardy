module.exports = function(socket, gameLoop) {
    let events = [
        'move-pick',
        'lock-pick',
        'buzzed'
    ];

    socket.request.user.socketId = socket.id;
    gameLoop.contestantCheckIn(socket.request.user, ()=>{});

    socket.on('message', (msg) => {
        console.log('Got contestant message. ' + msg);
        gameLoop.emitAll('outgoing', 'this is all!');
    });

    for(let i=0; i<events.length; i++) {
        fwdToLoop(socket, events[i]);
    }

    function fwdToLoop(socket, event) {
        socket.on(event, (data) => {
            gameLoop.onContestant(event, socket.request.user, data);
        });
    }
};