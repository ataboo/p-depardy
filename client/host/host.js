window.$ = require('jquery');

$(document).ready(function () {
    initSocket();
});

function initSocket() {
  window.WebSocket = window.WebSocket || window.MozWebSocket;

  let socket = new WebSocket('ws://localhost:3000/host');

    $('.socket-button').on('click', function() {
        let event = $(this).data('event');
        let data = $(this).data('event-data');

        console.log('emitting: '+event+' with data: '+data);

        socket.send(JSON.stringify({event: event, data: data}));
    });
}
