class GridDisplay {
    constructor() {
        this.$gridHolder = $('.grid-holder');
        this.$questionHolder = $('.fullscreen-question');
        this.$questionContent = $('.question-content');
        this.$playerHolder = $('.player-holder');
    }

    renderGrid(data) {
        this.$questionHolder.hide();

        this.$gridHolder.html('');

        $(data.gridSquares).each((x, gridSquare) => {
            let $column = GridDisplay._makeColumn().appendTo(this.$gridHolder);
            let $category = $column.find('.jep-square');
            $category.html(data.categories[x]);
            $(gridSquare).each(function(y, value) {
                let dispVal = value > 0 ? '$'+value : '';
                let $newSquare = $category.clone().removeClass('category').appendTo($column).html(dispVal);
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
        $('.player-buzzed').removeClass('player-buzzed');
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

    hideQuestion(data) {
        this.$questionHolder.hide();
        this.$gridHolder.show();
        $('.player-card').removeClass('player-buzz-wait player-buzzed player-right player-wrong');

        $('.player-card[data-player-id="'+data.player_id+'"]').addClass('player-buzzed');
    }

    updateUsers(data) {
        this.$playerHolder.children().not('.template').attr('data-delete-me', true);

        $(data.players).each((index, player) => {
            this._createOrUpdatePlayer(player);
        })

        this.$playerHolder.find('[data-delete-me="true"]').remove();
    }

    startBuzz(data) {
        console.log('starting buzz.');
        $('.player-card:not(.card-red)').addClass('player-buzz-wait');
    }

    buzzAccepted(data) {
        $('.player-card:not(.template)').removeClass('player-buzz-wait');
        $('.player-card[data-player-id="'+data.player_id+'"]').addClass('player-buzzed');
    }

    answerRight() {
        console.log('got right');
        $('.player-buzzed').addClass('player-right').removeClass('player-buzzed');
    }

    answerWrong() {
        console.log('got wrong');
        $('.player-buzzed').addClass('player-wrong').removeClass('player-buzzed');
    }

    _createOrUpdatePlayer(player) {
        let $existing = this.$playerHolder.find('[data-player-id="'+player.id+'"]');
        if ($existing.length) {
            $existing.find('.player-score').html('$'+player.score);
            $existing.attr('data-delete-me', false);
            return;
        }

        let $template = this.$playerHolder
            .find('.template')
            .clone()
            .removeClass('template')
            .appendTo(this.$playerHolder);

        $template.attr('data-player-id', player.id);
        $template.find('.player-name').html(player.name);
        $template.find('.player-score').html('$'+player.score);
        $template.show();
    }

    static _makeColumn() {
        return $('.jep-column.template').clone().removeClass('template');
    }
    static _squareForGrid(grid) {
        return $('.jep-square[data-grid-x="'+grid[0]+'"][data-grid-y="'+grid[1]+'"]')
    }
}

module.exports = GridDisplay;
