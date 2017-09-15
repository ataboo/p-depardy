window.$ = require('jquery');

(function() {
    $(document).ready(function () {
        initSocket();
    });

    function initSocket() {
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
                renderGrid(data);
                break;
            case 'highlight-square':
                highlightSquare(data);
                break;
            case 'show-question':
                showQuestion(data);
                break;
            case 'show-answer':
                showAnswer(data);
                break;
            case 'picking':
                hideQuestion();
                break;
            default:
                console.error('Event: '+event+' is not supported.');
        }
    }

    function renderGrid(data) {
        $(data.gridSquares).each(function(x, gridSquare) {
            let $column = makeColumn();
            let $category = $column.find('.jep-square');
            $category.html(data.categories[x]);
            $(gridSquare).each(function(y, value) {
                let $square = $category.clone().appendTo($column).html(value);
                $square.attr('data-grid-x', x).attr('data-grid-y', y);
            });
        });

        $('.jep-column:not(.template), .jep-row').show();
    }

    function makeColumn(category) {
        return $('.jep-column.template').clone().appendTo($('.jep-row')).removeClass('template');
    }

    function highlightSquare(data) {
        $('.jep-square.square-hover').removeClass('square-hover');
        squareForGrid(data).addClass('square-hover');
    }

    function squareForGrid(grid) {
        return $('.jep-square[data-grid-x="'+grid[0]+'"][data-grid-y="'+grid[1]+'"]')
    }

    function showQuestion(data) {

        $('.square-hover').html('');
        $('.question-content').html(data.question);
        $('.fullscreen-question').show();
        console.log(data);
    }

    function showAnswer(data) {
        $('.question-content').html(data.answer);
        $('.fullscreen-question').show();
    }

    function hideQuestion() {
        $('#fullscreen-question').hide();
    }
})();