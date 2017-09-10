let util = require('util');
const $ = require('jquery');
let io = require('socket.io-client');

$(document).ready(function () {
    initSocket();
});

function initSocket() {
    let socket = io();

    $('.socket-button').on('click', function() {
        let event = $(this).data('event');
        let data = $(this).data('event-data');

        console.log('emitting: '+event);

        socket.emit(event, data);
    });

    $('#bootan').on('click', function () {
        console.log('firing message!');
        socket.emit('message', 'TadaaTown!!!');
    });
    //
    // socket.on('message', (content) => {
    //     $('#message-box').html(content);
    // })

    socket.on('outgoing', (content) => {
        $('#message-box').html(content);
    })
}
