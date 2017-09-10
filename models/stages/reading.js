module.exports = function(gameLoop) {
    let Stage = require('./stage')();

    class Reading extends Stage {
        entry() {
            console.log('Reading entry.');

            this.gameLoop.emitAll('show-question', this.gameLoop.currentGridSquare().public());
        }

        onHost(event, user, data) {
            if (event === 'start-buzz') {
                for(let id of Object.keys(this.gameLoop.contestants)) {
                    this.gameLoop.contestants[id].buzzed = false;
                }
                this.gameLoop.setStage('buzzing');
            }
        }
    }

    return new Reading(gameLoop);
};