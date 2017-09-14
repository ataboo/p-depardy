module.exports = function(gameLoop) {
    let Stage = require('./stage')();

    class Reading extends Stage {
        entry() {
            console.log('Reading entry.');

            this.gameLoop.emitAll('show-question', this.gameLoop.gameData.currentGridSquare().public());
        }

        onHost(event, user, data) {
            if (event === 'start-buzz') {
                for(let id of Object.keys(this.gameLoop.gameData.contestants)) {
                    this.gameLoop.gameData.findContestants(id).buzzed = false;
                }
                this.gameLoop.setStage('buzzing');
            }
        }
    }

    return new Reading(gameLoop);
};