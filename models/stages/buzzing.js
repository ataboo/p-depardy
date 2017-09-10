module.exports = function(gameLoop) {
    let Stage = require('./stage')();

    class Buzzing extends Stage {
        entry() {
            console.log('Waiting for Buzz.');
        }

        onContestant(event, user, data) {
            if(event === 'buzzed') {
                let contestant = this.gameLoop.contestants[user.id];

                if (contestant && !contestant.buzzed) {
                    this.gameLoop.emitAll('buzz-accepted', user.id);
                    contestant.buzzed = true;
                    this.gameLoop.setStage('checking');
                }
            }
        }

        onHost(event, user, data) {
            if(event === 'give-up') {
                this.gameLoop.setStage('show_answer');
            }
        }
    }

    return new Buzzing(gameLoop);
};