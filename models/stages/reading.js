module.exports = function(gameLoop) {
    let Stage = require('./stage')();

    class Reading extends Stage {
        entry() {
            console.log('Reading entry.');

            this.gameLoop.emitAll('show-question', this.gameLoop.activeQuestion.public());
        }

        onHost(event, user, data) {
            if (event === 'start-buzz') {
                for(let i=0; i<Object.values(this.gameLoop.contestants); i++) {
                    delete Object.values(this.gameLoop.contestants)[i].buzzed;
                }
                this.gameLoop.setStage('buzzing');
            }
        }
    }

    return new Reading(gameLoop);
};