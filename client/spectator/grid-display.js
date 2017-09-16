class GridDisplay {
    constructor() {
        this.$gridHolder = $('.grid-holder');
        this.$questionHolder = $('.fullscreen-question');
        this.$questionContent = $();

    }

    renderGrid(data) {
        this.$questionHolder.hide();

        $(data.gridSquares).each((x, gridSquare) => {
            let $column = GridDisplay._makeColumn().appendTo(this.$gridHolder);
            let $category = $column.find('.jep-square');
            $category.html(data.categories[x]);
            $(gridSquare).each(function(y, value) {
                let $newSquare = $category.clone().removeClass('category').appendTo($column).html('$'+value);
                $newSquare.attr('data-grid-x', x).attr('data-grid-y', y);
            });
        });

        $('.jep-column:not(.template)').show();
        this.$gridHolder.show();
    }

    highlightSquare(data) {
        $('.jep-square.square-hover').removeClass('square-hover');
        GridDisplay._squareForGrid(data).addClass('square-hover');
    }

    showQuestion(data) {
        this.$gridHolder.hide();
        $('.square-hover').html('');
        this.$questionContent.html(data.question);
        this.$questionHolder.show();
        console.log(data);
    }

    showAnswer(data) {
        this.$gridHolder.hide();
        this.$questionContent.html(data.answer);
        this.$questionHolder.show();
    }

    hideQuestion() {
        this.$questionHolder.hide();
        this.$gridHolder.show();
    }

    static _makeColumn() {
        return $('.jep-column.template').clone().removeClass('template');
    }
    static _squareForGrid(grid) {
        return $('.jep-square[data-grid-x="'+grid[0]+'"][data-grid-y="'+grid[1]+'"]')
    }
}

module.exports = GridDisplay;