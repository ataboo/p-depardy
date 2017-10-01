module.exports = function(gameLoop) {
    let Stage = require('./stage')();

    class Buzzing extends Stage {
        entry() {
        }

        sync() {
            this.gameLoop.emit('start-buzzing', gameLoop.unbuzzedPlayers(), '');
            this.gameLoop.emitSpectators('start-buzzing', {grid_square: gameLoop.gameData.currentGridSquare().public()});
            this.gameLoop.emitHost('start-buzzing');
        }

        onContestant(event, user, data) {
            if(event === 'buzzed') {
                let contestant = this.gameLoop.gameData.player(user.id);
                if (contestant && !contestant.buzzed) {
                    this.gameLoop.gameData.checkingContestant = contestant.id;

                    contestant.buzzed = true;
                    this.gameLoop.setStage('checking');
                } else {
                    console.log('Fail buzz: ');
                    console.log(contestant.public());
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
