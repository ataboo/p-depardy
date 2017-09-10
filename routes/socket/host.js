module.exports = function(socket, gameLoop) {
    let events = [
        'start-pick',
        'start-buzz',
        'right-answer',
        'wrong-answer',
    ];

    socket.request.user.socketId = socket.id;
    gameLoop.hostCheckIn(socket.request.user, ()=>{});

    socket.on('message', (msg) => {
        // gameLoop.emitContestants('outgoing', 'this is daters!');
        gameLoop.emitAll('outgoing', 'this is to all!');

        console.log('Got host message. ' + msg);
    });

    for(let i=0; i<events.length; i++) {
        fwdToLoop(socket, events[i]);
    }

    function fwdToLoop(socket, event) {
        socket.on(event, (data) => {
            gameLoop.onHost(event, socket.request.user, data);
        });
    }
};