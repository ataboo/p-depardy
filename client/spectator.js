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
            default:
                console.error('Event: '+event+' is not supported.');
        }
    }

    function renderGrid(data) {
        $(data.gridSquares).each(function(x, gridSquare) {
            let $column = makeColumn();
            let $category = $column.find('.jep-square');
            $category.html(data.catagories[x]);
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
        $('.jep-square[data-grid-x="'+data[0]+'"][data-grid-y="'+data[1]+'"]').addClass('square-hover');
    }
})();