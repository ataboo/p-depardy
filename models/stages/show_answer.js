module.exports = function(gameLoop) {
    let Stage = require('./stage')();

    class ShowAnswer extends Stage {
        entry() {
            console.log('Showing Answer.');
            this.gameLoop.gameData.currentGridSquare().blank = true;
        }

        sync() {
            this.gameLoop.emitAll('show-answer', {grid_square: this.gameLoop.gameData.currentGridSquare(), ready: this.gameLoop.ready()});
        }

        onHost(event, user, data) {
            if (event === 'start-pick') {
                this.gameLoop.setStage('picking');
            }
        }
    }

    return new ShowAnswer(gameLoop);
};
