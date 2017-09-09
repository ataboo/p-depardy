let util = require('util');
const $ = require('jquery');
let io = require('socket.io-client');

$(document).ready(function() {
    initSocket();
})

function initSocket() {
    let socket = io();

    $('#bootan').on('click', function() {
        console.log('firing message!');
        socket.emit('message', 'TadaaTown!!!');
    })

    socket.on('message', (content) => {
        $('#message-box').html(content);
    })
}
