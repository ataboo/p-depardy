window.$ = require('jquery');

(function() {
    const ClientHandler = require('./../client-handler');
    const GridDisplay = require('./grid-display');

    let gridDisplay;

    $(document).ready(function () {
        gridDisplay = new GridDisplay();
        ClientHandler.initSocket('ws://localhost:3000/spectator', handleEvent);
    });

    function handleEvent(event, data) {
        switch(event) {
            case 'init-grid':
                gridDisplay.renderGrid(data.grid);
                gridDisplay.updateUsers(data);
                break;
            case 'highlight-square':
                gridDisplay.highlightSquare(data);
                break;
            case 'show-question':
                gridDisplay.showQuestion(data);
                break;
            case 'show-answer':
                gridDisplay.showAnswer(data);
                break;
            case 'picking':
                gridDisplay.hideQuestion(data);
                break;
            case 'update-users':
                gridDisplay.updateUsers(data);
                break;
            case 'start-buzzing':
                gridDisplay.startBuzz(data);
                break;
            case 'buzz-accepted':
                gridDisplay.buzzAccepted(data);
                break;
            case 'right-answer':
                gridDisplay.answerRight(data);
                break;
            case 'wrong-answer':
                gridDisplay.answerWrong(data);
                break;
            default:
                console.error('Event: '+event+' is not supported.');
        }
    }
})();
