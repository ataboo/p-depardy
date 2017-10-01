window.$ = require('jquery');

(function() {
    const ClientHandler = require('./../client-handler');
    let socket;
    let myId;
    let $buzzer;

    $.fn.toggleBell = function(toggle) {
        this.find('i.fa').toggleClass('fa-bell-slash', !toggle).toggleClass('fa-bell', toggle);
        return this;
    }

    $(document).ready(function () {
        socket = ClientHandler.initSocket(handleEvent);

        initButtons();
    });

    function initButtons() {
        $('.socket-button').on('click', function() {
            let event = $(this).data('event');
            let data = $(this).data('event-data');

            console.log('emitting: '+event+' with data: '+data);

            socket.send(JSON.stringify({event: event, data: data}));
        });

        $buzzer = $('.buzzer');

        $buzzer.on('click', function() {
            if ($(this).hasClass('buzzer-ready')) {
                $buzzer.prop('disabled', true);
                socket.send(JSON.stringify({event: 'buzzed', data: {player_id: myId}}));
                console.log('Sending buzz!');
            }

            return false;
        });
    }

    function handleEvent(event, data) {
        switch(event) {
            case 'picking':
                showPick();
                break;
            case 'show-question':
                showQuestion(data);
                break;
            case 'show-answer':
                showAnswer();
                break;
            case 'start-buzzing':
                startBuzz();
                break;
            case 'buzz-accepted':
                buzzAccepted(data);
                break;
            case 'check-in':
                checkIn(data);
            break;
            case 'wrong-answer':
                answerWrong();
            break;
            case 'right-answer':
                answerRight();
            break;
        }
    }

    function showPick() {
        $('.buzz-holder').hide();

        console.log('showing pick');
        $('.pick-buttons').show();
    }

    function showQuestion(data) {
        $buzzer.toggleBell(false)
            .removeClass('buzzer-ready buzzer-buzzed buzzer-right buzzer-wrong')
            .prop('disabled', false)
            .show()

        $('.pick-buttons').hide();
        $('.buzz-holder').show();
    }

    function startBuzz() {
        $('.buzz-holder').show();
        $buzzer.addClass('buzzer-ready').toggleBell(true);
    }

    function buzzAccepted(data) {
        $buzzer.toggleBell(true)
            .removeClass('buzzer-ready')
            .prop('disabled', false);
        if (data.player_id == myId) {
            $buzzer.addClass('buzzer-buzzed');
        } else {
            $buzzer.toggleBell(false);
        }
    }

    function checkIn(data) {
        myId = data.player_id;
    }

    function answerWrong() {
        $buzzer.toggleBell(false).removeClass('buzzer-buzzed').addClass('buzzer-wrong');
    }

    function showAnswer() {
        $buzzer.toggleBell(false).removeClass('buzzer-ready buzzer-buzzed buzzer-right buzzer-wrong');
    }

    function answerRight() {
        $buzzer.removeClass('buzzer-buzzed').addClass('buzzer-right');
    }
})();
