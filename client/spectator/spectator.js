window.$ = require('jquery');

(function() {
    const GridDisplay = require('./grid-display');

    let gridDisplay;

    $(document).ready(function () {
        initSocket();
    });

    function initSocket() {
        gridDisplay = new GridDisplay();

        //TODO: generate routes in ejs.
        let socket = new WebSocket('ws://localhost:3000/spectator');

        socket.onmessage = (raw) => {
            console.log(raw);

            let data = JSON.parse(raw.data);
            if (data.event) {
                handleEvent(data.event, data.data);
            }
        };
    }

    function handleEvent(event, data) {
        switch(event) {
            case 'init-grid':
                gridDisplay.renderGrid(data);
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
                gridDisplay.hideQuestion();
                break;
            default:
                console.error('Event: '+event+' is not supported.');
        }
    }
})();