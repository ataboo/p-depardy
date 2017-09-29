module.exports = function(gameLoop) {
    let Stage = require('./stage')();

    class Checking extends Stage {
        entry() {
            console.log('Checking answer.');
        }

        onHost(event, user, data) {
            if (event === 'right-answer') {
                this.gameLoop.awardScoreToCurrent();
                this.gameLoop.emitAll('right-answer', { player_id: gameLoop.gameData.checkingContestant });
                this.wrapUp();
                return;
            }

            if (event === 'wrong-answer') {
                this.gameLoop.emitAll('wrong-answer', { player_id: gameLoop.gameData.checkingContestant });
                let unbuzzed = gameLoop.unbuzzedPlayers();
                if (unbuzzed.length) {
                    this.gameLoop.setStage('buzzing');
                } else {
                    this.wrapUp();
                }
            }
        }

        wrapUp() {
            this.gameLoop.syncUsers();
            this.gameLoop.setStage('show_answer');
        }
    }

    return new Checking(gameLoop);
};
