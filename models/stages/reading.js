module.exports = function(gameLoop) {
    let Stage = require('./stage')();

    class Reading extends Stage {
        entry() {
            console.log('Reading entry.');
        }

        sync() {
            this.gameLoop.emitAll('show-question', this.gameLoop.gameData.currentGridSquare().public());
        }

        onHost(event, user, data) {
            if (event === 'start-buzz') {
                this.gameLoop.resetBuzzing();
                this.gameLoop.setStage('buzzing');
            }
        }
    }

    return new Reading(gameLoop);
};