module.exports = function(gameLoop) {
    let Stage = require('./stage')();

    class Buzzing extends Stage {
        entry() {
            console.log('Waiting for Buzz.');
        }

        onContestant(event, user, data) {
            if(event === 'buzzed') {
                let contestant = this.gameLoop.gameData.findContestants(user.id);
                if (contestant && !contestant.buzzed) {
                    this.gameLoop.gameData.checkingContestant = contestant.id;
                    this.gameLoop.emitAll('buzz-accepted', {user_id: contestant.id});
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