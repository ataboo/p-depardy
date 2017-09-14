module.exports = function(gameLoop) {
    let Stage = require('./stage')();

    class ShowAnswer extends Stage {
        entry() {
            console.log('Showing Answer.');
            this.gameLoop.gameData.currentGridSquare().blank = true;
            this.gameLoop.emitAll('show-answer', this.gameLoop.gameData.currentGridSquare());
        }

        onHost(event, user, data) {
            if (event === 'start-pick') {
                this.gameLoop.setStage('picking');
            }
        }
    }

    return new ShowAnswer(gameLoop);
};