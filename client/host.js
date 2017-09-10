window.$ = require('jquery');
let io = require('socket.io-client');

$(document).ready(function () {
    initSocket();
});

function initSocket() {
    let socket = io();
    let checkingUserId;

    $('.socket-button').on('click', function() {
        let event = $(this).data('event');
        let data = $(this).data('event-data');

        console.log('emitting: '+event+' with data: '+data);

        socket.emit(event, data);
    });

    socket.on('buzz-accepted', function(data) {
        $('.answer-button').data('event-data', JSON.stringify({ user_id: data.user_id }));
    });

    socket.on('outgoing', (content) => {
        $('#message-box').html(content);
    })
}
