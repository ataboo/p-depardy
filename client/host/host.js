window.$ = require('jquery');

(function() {
    const ClientHandler = require('./../client-handler');
    let socket;
    const confirmMap = {
        give_up: 'Are you sure you want to give up on this question?',
    };

    $(document).ready(function () {
        socket = ClientHandler.initSocket(handleEvent);
        initButtons();
    });

    function initButtons() {
        $('.socket-button').on('click', function() {
            let event = $(this).data('event');
            let data = $(this).data('event-data');

            send(event, data);
        });
    }

    function handleEvent(event, data) {
        switch(event) {
            case 'show-question':
                showQuestion();
                break;
            case 'pre-start':
                preStart(data);
                break;
            case 'picking':
                picking();
                break;
            case 'start-buzzing':
                buzzing();
                break;
            case 'checking-answer':
                checkingAnswer(data);
                break;
            case 'show-answer':
                showAnswer(data);
                break;
        }

    }

    function send(event, data) {
        let msg = confirmMessage(event);
        if (msg) {
            if(!confirm(msg)) {
                return;
            }
        }

        $('.'+event).prop('disabled', true);

        console.log('emitting: '+event+' with data: '+data);

        socket.send(JSON.stringify({event: event, data: data}));
    }

    function showQuestion() {
        $('.start-pick').hide();
        $('.start-buzz').prop('disabled', false).show();
    }

    function preStart(data) {
        $('.start-pick').prop('disabled', !data.ready).show();
    }

    function picking() {
        $('.start-pick').prop('disabled', true).show();
    }

    function buzzing() {
        $('.start-buzz').hide();
        $('.give-up').prop('disabled', false).show();
    }

    function checkingAnswer(data) {
        if(!data.player || !data.grid_square) {
            console.error('Invalid checking answer data!');
        }

        $('.give-up').hide();

        $('.player-check').html('<h4>'+data.player.name+' Buzzed!</h4>');
        $('.answer-holder p').html(data.grid_square.answer);

        $('.right-answer').prop('disabled', false);
        $('.wrong-answer').prop('disabled', false);
        $('.check-holder').show();
    }

    function showAnswer(data) {
        $('.give-up').hide();
        $('.check-holder').hide();
        preStart(data);
    }

    function confirmMessage(event) {
        let eventSnake = event.replace('-', '_');
        return confirmMap[eventSnake];
    }
})();
